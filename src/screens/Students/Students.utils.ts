import { collection, doc, getDocs, getDoc, getFirestore, query, where, deleteDoc, updateDoc, runTransaction, DocumentReference, setDoc, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
import { GenericStudentType, StudentClass } from "./Students.interface";
import { auth } from "@/src/config/firebaseConfig";

// Resolve the instructor document that belongs to the currently-logged user
const getCurrentInstructorRef = async () => {
    const firestore = getFirestore();
    const currentUser = auth.currentUser;
    if (!currentUser) {
        console.log("No current user found");
        return null;
    }

    console.log("Current user UID:", currentUser.uid);

    // 1. Try doc with the same uid
    const directRef = doc(firestore, `instructors/${currentUser.uid}`);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) {
        console.log("Found instructor doc directly");
        return directRef;
    }

    console.log("Direct instructor doc not found, trying authUid query");

    // 2. Fallback – query by authUid field
    const instructorsRef = collection(firestore, "instructors");
    const q = query(instructorsRef, where("authUid", "==", currentUser.uid));
    const qs = await getDocs(q);
    if (!qs.empty) {
        console.log("Found instructor doc via authUid query");
        return qs.docs[0].ref;
    }

    console.log("No instructor doc found via any method");
    return null;
};

/**
 * Resolve an instructor DocumentReference given the Firebase Auth UID (authUid).
 * This function always prefers the `authUid` field, but will gracefully
 * fallback to a document with the same id when present (legacy data).
 */
const getInstructorRefByAuthUid = async (authUid: string): Promise<DocumentReference> => {
    const firestore = getFirestore();
    // Try to find by authUid field first (canonical)
    const colRef = collection(firestore, "instructors");
    const q = query(colRef, where("authUid", "==", authUid));
    const qs = await getDocs(q);
    if (!qs.empty) {
        return qs.docs[0].ref;
    }
    // Fallback to a doc with id == authUid (legacy)
    return doc(firestore, `instructors/${authUid}`);
};

const getStudentsByInstructor = async () => {
    const firestore = getFirestore();
    const instructorRef = await getCurrentInstructorRef();
    if (!instructorRef) return [] as GenericStudentType[];
    const studentsRef = collection(firestore, "students");

    // Check if current user is admin
    const currentUser = auth.currentUser;
    if (!currentUser) return [] as GenericStudentType[];
    
    const instructorDoc = await getDoc(instructorRef);
    if (!instructorDoc.exists()) return [] as GenericStudentType[];
    
    const instructorData = instructorDoc.data() as { isAdmin?: boolean };
    const isAdmin = instructorData.isAdmin === true;

    if (isAdmin) {
        // Admin sees all students in their franchise
        const { franchise } = instructorData as { franchise?: any };
        if (!franchise) return [] as GenericStudentType[];
        
        const q = query(studentsRef, where("instructor", "==", instructorRef));
        const querySnapshot = await getDocs(q);
        const students = querySnapshot.docs.map(doc => ({ ...doc.data() as GenericStudentType }));
        return students;
    } else {
        // Instrutor comum: alunos que contenham seu authUid no array ou atribuição direta
        const q1 = query(studentsRef, where("instructor", "==", instructorRef));
        const authUid = (instructorDoc.data() as any)?.authUid as string | undefined;
        const q2 = authUid
            ? query(studentsRef, where("instructorsUids", "array-contains", authUid))
            : null;
        const [snap1, snap2] = await Promise.all([getDocs(q1), q2 ? getDocs(q2) : Promise.resolve({ docs: [] as any[] } as any)]);
        const merged: Record<string, GenericStudentType> = {};
        [...snap1.docs, ...snap2.docs].forEach((d) => {
            merged[d.id] = d.data() as GenericStudentType;
        });

        // Exibe apenas alunos que ainda possuam pelo menos uma aula deste instrutor
        const filtered = Object.values(merged).filter((student) => {
            if (!student.classes || student.classes.length === 0) return false;

            return student.classes.some((studentClass) => {
                // Aula sem campo "instructor" = legado, considerada do instrutor se o próprio aluno pertence a ele
                if (!studentClass.instructor) {
                    return student.instructor?.path === instructorRef.path;
                }
                // Nova abordagem: compara o caminho do DocumentReference
                return studentClass.instructor?.path === instructorRef.path;
            });
        });

        return filtered;
    }
};

const checkIfInstructorIsAdmin = async (): Promise<boolean> => {
    const instructorRef = await getCurrentInstructorRef();
    if (!instructorRef) return false;
    const instructorSnap = await getDoc(instructorRef);

    if (!instructorSnap.exists()) return false;

    const instructorData = instructorSnap.data() as { isAdmin?: boolean };
    return instructorData.isAdmin === true;
};

const deleteStudentById = async (id: string | undefined) => {
    if (!id) return;
    const firestore = getFirestore();
    const docRef = doc(firestore, `students/${id}`);
    await deleteDoc(docRef);
};

const getInstructorsByFranchise = async () => {
    const firestore = getFirestore();
      // resolve logged instructor doc
  const currentInstructorRef = await getCurrentInstructorRef();
  if (!currentInstructorRef) return [];
  const currentInstructorSnap = await getDoc(currentInstructorRef);
  const { franchise } = currentInstructorSnap.data() as { franchise?: any };
    if (!franchise) return [];

    const instructorsRef = collection(firestore, "instructors");
    const q = query(instructorsRef, where("franchise", "==", franchise));
    const snap = await getDocs(q);

    // IMPORTANT: return authUid as the id used by the UI (value field)
    const instructors = snap.docs.map(d => {
        const data = d.data() as any;
        return { id: data?.authUid || d.id, ...(data as { name: string }) };
    });
    return instructors;
};

/**
 * Fetch psychologists that belong to the same franchise as the current instructor
 * Mirrors the instructors fetch flow but targets the `psico` collection
 */
const getPsychologistsByFranchise = async () => {
    const firestore = getFirestore();
    // Resolve the currently logged instructor to obtain the franchise reference
    const currentInstructorRef = await getCurrentInstructorRef();
    if (!currentInstructorRef) return [] as { id: string; name: string }[];
    const currentInstructorSnap = await getDoc(currentInstructorRef);
    const { franchise } = currentInstructorSnap.data() as { franchise?: any };
    if (!franchise) return [] as { id: string; name: string }[];

    const psychologistsRef = collection(firestore, "psico");
    const q = query(psychologistsRef, where("franchise", "==", franchise));
    const snap = await getDocs(q);

    const psychologists = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as { name: string }) }));
    return psychologists;
};

/**
 * Get a specific psychologist by their document ID
 * This function fetches psychologist data from the psico collection
 */
const getPsychologistById = async (psychologistId: string) => {
    if (!psychologistId) return null;
    
    try {
        console.log("🔍 Fetching psychologist with ID:", psychologistId);
        const firestore = getFirestore();
        const psychologistRef = doc(firestore, `psico/${psychologistId}`);
        const psychologistSnap = await getDoc(psychologistRef);
        
        if (psychologistSnap.exists()) {
            const data = psychologistSnap.data();
            console.log("🔍 Psychologist data found:", { id: psychologistSnap.id, ...data });
            return {
                id: psychologistSnap.id,
                ...data
            };
        } else {
            console.log("🔍 Psychologist document does not exist for ID:", psychologistId);
        }
        return null;
    } catch (error) {
        console.error("🔍 Error fetching psychologist:", error);
        return null;
    }
};

const updateStudentInstructor = async (studentId: string | undefined, instructorAuthUid: string) => {
    if (!studentId) return;
    const firestore = getFirestore();
    // instructorAuthUid is the Firebase Auth UID. Resolve the actual document by authUid.
    const instructorRef = await getInstructorRefByAuthUid(instructorAuthUid);
    const studentRef = doc(firestore, `students/${studentId}`);
    await updateDoc(studentRef, { instructor: instructorRef });
};

/**
 * Check if a given class collides with any class already scheduled for the target instructor.
 * Returns the name of the student that owns the colliding class or null when the slot is free.
 */
const isClassScheduledForInstructor = async (
    newClass: StudentClass,
    instructorRef: DocumentReference,
    currentClassId?: string,
    instructorAuthUid?: string,
): Promise<string | null> => {
    const firestore = getFirestore();
    const studentsRef = collection(firestore, "students");

    // Students cujo campo principal aponta para o instrutor
    const q1 = query(studentsRef, where("instructor", "==", instructorRef));
    // Students que possuem o instrutor no array auxiliar (armazenamos authUid)
    const q2 = query(
        studentsRef,
        where("instructorsUids", "array-contains", instructorAuthUid ?? instructorRef.id),
    );

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const mergedDocs = [...snap1.docs, ...snap2.docs];
    if (mergedDocs.length === 0) return null;

    for (const studentDoc of mergedDocs) {
        const studentData = studentDoc.data();
        const existingClasses = studentData.classes || [];
        const newClassDate = newClass.classDate;
        const newClassStart = dayjs(`1970-01-01T${newClass.classStartTime}:00`);
        const newClassEnd = dayjs(`1970-01-01T${newClass.classEndTime}:00`);

        const collision = existingClasses.some((existing: StudentClass) => {
            if (existing.id === currentClassId) return false;
                        const existingDateFormatted = dayjs(existing.classDate, ["DD/MM/YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
            const newDateFormatted = dayjs(newClassDate, ["DD/MM/YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
            if (existingDateFormatted !== newDateFormatted) return false;
            const existingStart = dayjs(`1970-01-01T${existing.classStartTime}:00`);
            const existingEnd = dayjs(`1970-01-01T${existing.classEndTime}:00`);
            return newClassStart.isBefore(existingEnd) && newClassEnd.isAfter(existingStart);
        });

        if (collision) {
            return studentData.name as string;
        }
    }
    return null;
};

/**
 * Atomically moves a student to a different instructor while validating schedule conflicts.
 */
const moveStudentToInstructor = async (
    studentId: string,
    targetInstructorAuthUid: string,
) => {
    if (!studentId) throw new Error("Student id is required");

    const firestore = getFirestore();
    const studentRef = doc(firestore, `students/${studentId}`);
    const instructorRef = await getInstructorRefByAuthUid(targetInstructorAuthUid);

    await runTransaction(firestore, async (tx) => {
        const [studentSnap, instructorSnap] = await Promise.all([
            tx.get(studentRef),
            tx.get(instructorRef),
        ]);

        if (!studentSnap.exists()) {
            throw new Error("Student not found");
        }
        if (!instructorSnap.exists()) {
            throw new Error("Instructor not found");
        }

        const studentData = studentSnap.data() as GenericStudentType;
        const classes = studentData.classes || [];

        // validate collisions for every class
        const instructorData = instructorSnap.data() as any;
        const authUid = instructorData?.authUid as string | undefined;
        for (const c of classes) {
            const collisionName = await isClassScheduledForInstructor(c, instructorRef, undefined, authUid);
            if (collisionName) {
                throw new Error(
                    `Conflito de horário: já existe aula entre ${c.classStartTime} e ${c.classEndTime} com ${collisionName}`,
                );
            }
        }

        // write update
        tx.update(studentRef, { instructor: instructorRef });
    });
};

/**
 * Creates a COPY of a student assigned to a different instructor and appends the given classes.
 */
const copyStudentToInstructor = async (
    student: GenericStudentType,
    targetInstructorAuthUid: string,
    classes: StudentClass[],
) => {
    const firestore = getFirestore();
    const studentsRef = collection(firestore, "students");
    const instructorRef = await getInstructorRefByAuthUid(targetInstructorAuthUid);

    // Create a new Firestore document (auto-generated id)
    const newStudentDoc = doc(studentsRef);

    // Generate a numeric id to avoid collisions (timestamp based)
    const newStudentId = Date.now();

    await setDoc(newStudentDoc, {
        ...student,
        id: newStudentId,
        instructor: instructorRef,
        classes: classes,
    });
};

export { getStudentsByInstructor, checkIfInstructorIsAdmin, deleteStudentById, getInstructorsByFranchise, getPsychologistsByFranchise, getPsychologistById, updateStudentInstructor, getCurrentInstructorRef, moveStudentToInstructor, copyStudentToInstructor, getStudentsLocalFirst, getInstructorRefByAuthUid };

/**
 * Cursor types for paginated fetch
 */
export type StudentsPageCursors = {
    /** Firestore cursors (typed as any to avoid SDK generic mismatches across versions) */
    primary?: any | null;
    secondary?: any | null;
};

export type StudentsPage = {
    students: GenericStudentType[];
    cursors: StudentsPageCursors;
    exhausted: boolean; // true when no more documents in both queries
};

/**
 * Paginated fetch for students belonging to the current instructor.
 * This function implements a simple but effective pagination strategy
 * that avoids duplicates by using document references as cursors.
 */
/**
 * Fetch all students for the current instructor once (no pagination),
 * cache locally (AsyncStorage) to reduce Firestore reads, and
 * return sorted results. Cache key is per-instructor.
 */
const getStudentsLocalFirst = async (forceRefresh?: boolean): Promise<GenericStudentType[]> => {
    const firestore = getFirestore();
    const instructorRef = await getCurrentInstructorRef();
    if (!instructorRef) return [];

    const cacheKey = `students-cache:${instructorRef.id}`;

    if (!forceRefresh) {
        try {
            // Try local cache first
            const cached = await AsyncStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached) as any[];
                console.log("🔍 Using cached students data:", parsed.length, "students");
                // Re-hydrate document refs from stored paths
                const hydrated = parsed.map((s: any) => {
                    const firestore = getFirestore();
                    const result: any = { ...s };
                    if (typeof s.instructor === 'string' && s.instructor.includes('/')) {
                        const id = s.instructor.split('/').pop();
                        result.instructor = id ? doc(firestore, `instructors/${id}`) : null;
                    }
                    if (typeof s.psychologist === 'string' && s.psychologist.includes('/')) {
                        const id = s.psychologist.split('/').pop();
                        result.psychologist = id ? doc(firestore, `psico/${id}`) : null;
                    }
                    return result as GenericStudentType;
                });
                return hydrated as GenericStudentType[];
            }
        } catch {}
    }

    console.log("🔍 Fetching fresh students data from Firestore...");
    // Not cached → fetch for this instructor
    const studentsRef = collection(firestore, "students");
    // Check admin flag to decide the fetching strategy
    const instructorSnap = await getDoc(instructorRef);
    const isAdmin = !!(instructorSnap.exists() && (instructorSnap.data() as any)?.isAdmin === true);
    
    // Update cache key to use authUid for non-admin users to avoid cache conflicts
    const instructorData = instructorSnap.data() as any;
    const authUid = instructorData?.authUid;
    const effectiveCacheKey = authUid ? `students-cache:${authUid}` : cacheKey;

    let docs: any[] = [];
    if (isAdmin) {
        // Admin: keep current behavior (students assigned directly)
        const q = query(studentsRef, where("instructor", "==", instructorRef));
        const snapshot = await getDocs(q);
        docs = snapshot.docs;
    } else {
        // Non-admin: include students assigned directly OR listed in instructorsUids
        const q1 = query(studentsRef, where("instructor", "==", instructorRef));
        // Get the authUid from the instructor document to query instructorsUids array
        const instructorData = instructorSnap.data() as any;
        const authUid = instructorData?.authUid;
        
        console.log("🔍 Non-admin instructor query:", {
            instructorRef: instructorRef.path,
            authUid: authUid,
            instructorData: instructorData
        });
        
        if (authUid) {
            // Query by both direct instructor assignment and instructorsUids array
            const q2 = query(studentsRef, where("instructorsUids", "array-contains", authUid));
            // Also query by the old document ID format (legacy support)
            const q3 = query(studentsRef, where("instructorsUids", "array-contains", instructorRef.id));
            console.log("🔍 Querying students with:", {
                directInstructor: instructorRef.path,
                instructorsUids: [authUid, instructorRef.id]
            });
            
            const [snap1, snap2, snap3] = await Promise.all([getDocs(q1), getDocs(q2), getDocs(q3)]);
            console.log("🔍 Query results:", {
                directInstructor: snap1.docs.length,
                instructorsUids: snap2.docs.length,
                instructorsUidsLegacy: snap3.docs.length
            });
            
            // Log some sample data for debugging
            if (snap1.docs.length > 0) {
                console.log("🔍 Sample direct instructor student:", snap1.docs[0].data().name);
            }
            if (snap2.docs.length > 0) {
                console.log("🔍 Sample authUid student:", snap2.docs[0].data().name);
            }
            if (snap3.docs.length > 0) {
                console.log("🔍 Sample legacy ID student:", snap3.docs[0].data().name);
            }
            
            const merged = [...snap1.docs, ...snap2.docs, ...snap3.docs];
            // Deduplicate by Firestore doc id
            const seen: Record<string, boolean> = {};
            docs = merged.filter((d) => {
                if (seen[d.id]) return false;
                seen[d.id] = true;
                return true;
            });
            console.log("🔍 Final merged and deduplicated:", docs.length);
        } else {
            // Fallback to direct instructor assignment only
            console.log("⚠️ No authUid found, falling back to direct instructor query only");
            const snapshot = await getDocs(q1);
            docs = snapshot.docs;
            console.log("🔍 Direct instructor query result:", docs.length);
        }
    }

    const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
    const hashStringToNumber = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0;
        }
        return Math.abs(hash);
    };

    const students = docs.map(d => {
        const data = d.data() as GenericStudentType;
        if (!(typeof data.id === "number" && Number.isFinite(data.id))) {
            data.id = hashStringToNumber(d.id);
        }
        (data as any).__docId = d.id;
        return data;
    }).sort((a, b) => collator.compare(a.name || "", b.name || ""));

    // Cache for 5 minutes (simple approach: store plus timestamp)
    try {
        // Save a SERIALIZABLE snapshot to cache (replace DocumentReferences with paths)
        const serializable = students.map((s: any) => ({
            ...s,
            instructor: s?.instructor?.path ?? null,
            psychologist: s?.psychologist?.path ?? (typeof s?.psychologist === 'string' ? s.psychologist : null),
        }));
        const payload = JSON.stringify(serializable);
        await AsyncStorage.setItem(effectiveCacheKey, payload);
        // best-effort TTL: we can clear stale cache on next load if needed
    } catch {}

    return students;
};
