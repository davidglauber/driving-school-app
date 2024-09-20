import { collection, doc, getDocs, getFirestore, query, where } from "firebase/firestore";
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

export { getStudentsByInstructor };
