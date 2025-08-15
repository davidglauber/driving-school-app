import { collection, doc, getDocs, getDoc, getFirestore, query, where, deleteDoc, updateDoc, runTransaction, DocumentReference, setDoc, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
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
        // Instrutor comum: alunos que contenham seu uid no array ou atribuição direta
        const q1 = query(studentsRef, where("instructor", "==", instructorRef));
        const q2 = query(studentsRef, where("instructorsUids", "array-contains", instructorRef.id));
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
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
    const firestore = getFirestore();
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    const instructorRef = doc(firestore, `instructors/${currentUser.uid}`);
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

    const instructors = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as { name: string }) }));
    return instructors;
};

const updateStudentInstructor = async (studentId: string | undefined, instructorId: string) => {
    if (!studentId) return;
    const firestore = getFirestore();
    const instructorRef = doc(firestore, `instructors/${instructorId}`);
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
): Promise<string | null> => {
    const firestore = getFirestore();
    const studentsRef = collection(firestore, "students");

    // Students cujo campo principal aponta para o instrutor
    const q1 = query(studentsRef, where("instructor", "==", instructorRef));
    // Students que possuem o instrutor no array auxiliar
    const q2 = query(studentsRef, where("instructorsUids", "array-contains", instructorRef.id));

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
    targetInstructorId: string,
) => {
    if (!studentId) throw new Error("Student id is required");

    const firestore = getFirestore();
    const studentRef = doc(firestore, `students/${studentId}`);
    const instructorRef = doc(firestore, `instructors/${targetInstructorId}`);

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
        for (const c of classes) {
            const collisionName = await isClassScheduledForInstructor(c, instructorRef);
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
    targetInstructorId: string,
    classes: StudentClass[],
) => {
    const firestore = getFirestore();
    const studentsRef = collection(firestore, "students");
    const instructorRef = doc(firestore, `instructors/${targetInstructorId}`);

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

export { getStudentsByInstructor, checkIfInstructorIsAdmin, deleteStudentById, getInstructorsByFranchise, updateStudentInstructor, getCurrentInstructorRef, moveStudentToInstructor, copyStudentToInstructor, getStudentsByInstructorPaginated };

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
export const getStudentsByInstructorPaginated = async (
    { pageSize, cursors }: { pageSize: number; cursors?: StudentsPageCursors }
): Promise<StudentsPage> => {
    const firestore = getFirestore();
    const instructorRef = await getCurrentInstructorRef();
    
    if (!instructorRef) {
        console.log("❌ No instructor ref found - user may not be logged in");
        return { students: [], cursors: { primary: null, secondary: null }, exhausted: true };
    }

    console.log("✅ Instructor ref found:", instructorRef.path);
    const studentsRef = collection(firestore, "students");

    try {
        // Simple strategy: Use only the primary query with document reference cursor
        // This ensures consistent pagination without duplicates
        
        let q = query(
            studentsRef, 
            where("instructor", "==", instructorRef), 
            limit(pageSize)
        );
        
        if (cursors?.primary) {
            console.log("📄 Using cursor for next page...");
            q = query(
                studentsRef, 
                where("instructor", "==", instructorRef), 
                startAfter(cursors.primary), 
                limit(pageSize)
            );
        }
        
        const snapshot = await getDocs(q);
        console.log(`📊 Query returned ${snapshot.docs.length} students`);
        
        if (snapshot.docs.length === 0) {
            console.log("📭 No more students found");
            return { 
                students: [], 
                cursors: { primary: null, secondary: null }, 
                exhausted: true 
            };
        }
        
        // Extract students and ensure they have unique IDs
        const students = snapshot.docs.map(doc => {
            const data = doc.data() as GenericStudentType;
            // Ensure the document ID is set
            if (!data.id) {
                data.id = parseInt(doc.id) || Date.now();
            }
            return data;
        });
        
        // Sort by name for consistent display
        students.sort((a, b) => a.name.localeCompare(b.name));
        
        // Set cursor for next page (use the last document as cursor)
        const nextCursor = snapshot.docs[snapshot.docs.length - 1];
        const exhausted = snapshot.docs.length < pageSize;
        
        console.log(`✅ Successfully fetched ${students.length} students, exhausted: ${exhausted}`);
        
        return { 
            students, 
            cursors: { primary: nextCursor, secondary: null }, 
            exhausted 
        };
        
    } catch (error) {
        console.error("❌ Error in paginated fetch:", error);
        
        // Fallback: try the original function
        console.log("🔄 Falling back to original getStudentsByInstructor function...");
        try {
            const fallbackStudents = await getStudentsByInstructor();
            console.log(`📊 Fallback returned ${fallbackStudents.length} students`);
            
            // Deduplicate fallback results by ID
            const uniqueFallback = fallbackStudents.filter((student, index, self) => 
                index === self.findIndex(s => s.id === student.id)
            );
            
            return {
                students: uniqueFallback.slice(0, pageSize),
                cursors: { primary: null, secondary: null },
                exhausted: uniqueFallback.length <= pageSize
            };
        } catch (fallbackError) {
            console.error("❌ Fallback also failed:", fallbackError);
            return {
                students: [],
                cursors: { primary: null, secondary: null },
                exhausted: true
            };
        }
    }
};
