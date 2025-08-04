import { collection, doc, getDocs, getDoc, getFirestore, query, where, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { GenericStudentType } from "./Students.interface";
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

    const q = query(studentsRef, where("instructor", "==", instructorRef));
    const querySnapshot = await getDocs(q);
  
    const students = querySnapshot.docs.map(doc => ({ ...doc.data() as GenericStudentType }));
    return students;
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

export { getStudentsByInstructor, checkIfInstructorIsAdmin, deleteStudentById, getInstructorsByFranchise, updateStudentInstructor, getCurrentInstructorRef };
