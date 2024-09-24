import { arrayUnion, collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { StudentClass } from "../../Students.interface";

const getClassesModalities = async () => {
    const firestore = getFirestore();
    const classesModalitiesRef = collection(firestore, "classesModalities");

    const querySnapshot = await getDocs(classesModalitiesRef);
    const classesModalities = querySnapshot.docs.map(doc => doc.data());
    return classesModalities;
};

const saveNewClasses = async (studentId: string, newClasses: StudentClass[]) => {
    const firestore = getFirestore();
    const studentDocRef = doc(firestore, `students/${studentId}`);

    await updateDoc(studentDocRef, {
        classes: arrayUnion(...newClasses)
    });
};


export { getClassesModalities, saveNewClasses };