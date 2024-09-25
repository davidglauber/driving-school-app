import { auth } from "@/src/config/firebaseConfig";
import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { FieldValues } from "react-hook-form";

const createUser = async (data: FieldValues) => {
  const firestore = getFirestore();
  const currentUser = auth.currentUser;
  const instructorRef = doc(firestore, `instructors/${currentUser?.uid}`);
  const dataToSend = {
    instructor: instructorRef,
    ...data,
  };

  const docRef = await addDoc(collection(firestore, "students"), dataToSend);
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
};

const editUser = async (id: string, data: FieldValues) => {
  const firestore = getFirestore();
  const docRef = doc(firestore, `students/${id}`);
  await updateDoc(docRef, data);
};

export { createUser, editUser };
