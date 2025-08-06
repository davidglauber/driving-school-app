import { collection, doc, getDocs, getDoc, getFirestore, query, where, deleteDoc, updateDoc, runTransaction, DocumentReference, setDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { GenericStudentType, StudentClass } from "./Students.interface";
import { auth } from "@/src/config/firebaseConfig";

// Resolve the instructor document that belongs to the currently-logged user
const getCurrentInstructorRef = async () => {
    const firestore = getFirestore();
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    // 1. Try doc with the same uid
    const directRef = doc(firestore, `instructors/${currentUser.uid}`);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) return directRef;

    // 2. Fallback – query by authUid field
    const instructorsRef = collection(firestore, "instructors");
    const q = query(instructorsRef, where("authUid", "==", currentUser.uid));
    const qs = await getDocs(q);
    if (!qs.empty) return qs.docs[0].ref;

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

    const q = query(studentsRef, where("instructor", "==", instructorRef));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    for (const studentDoc of querySnapshot.docs) {
        const studentData = studentDoc.data();
        const existingClasses = studentData.classes || [];
        const newClassDate = newClass.classDate;
        const newClassStart = dayjs(`1970-01-01T${newClass.classStartTime}:00`);
        const newClassEnd = dayjs(`1970-01-01T${newClass.classEndTime}:00`);

        const collision = existingClasses.some((existing: StudentClass) => {
            if (existing.id === currentClassId) return false;
            if (existing.classDate !== newClassDate) return false;
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

export { getStudentsByInstructor, checkIfInstructorIsAdmin, deleteStudentById, getInstructorsByFranchise, updateStudentInstructor, getCurrentInstructorRef, moveStudentToInstructor, copyStudentToInstructor };
