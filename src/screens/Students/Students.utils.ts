import { collection, doc, getDocs, getDoc, getFirestore, query, where, deleteDoc } from "firebase/firestore";
import { GenericStudentType } from "./Students.interface";
import { auth } from "@/src/config/firebaseConfig";

const getStudentsByInstructor = async () => {
    const firestore = getFirestore();
    const currentUser = auth.currentUser;
    const instructorRef = doc(firestore, `instructors/${currentUser?.uid}`);
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

export { getStudentsByInstructor, checkIfInstructorIsAdmin, deleteStudentById };
