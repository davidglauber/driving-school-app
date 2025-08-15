import { auth } from "@/src/config/firebaseConfig";
import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { getInstructorRefByAuthUid } from "../Students.utils";
import { FieldValues } from "react-hook-form";

const createUser = async (data: FieldValues) => {
  const firestore = getFirestore();
  const currentUser = auth.currentUser;
  // Resolve instructor document by authUid (preferred) with legacy fallback
  const instructorRef = currentUser?.uid
    ? await getInstructorRefByAuthUid(currentUser.uid)
    : doc(firestore, "instructors/__unknown__");
  // When a psychologist is chosen in the form, it comes as an object { label, value }
  // We convert it into a DocumentReference to keep consistency with instructor field
  const psychologistRef = data?.chosenPsychologist?.value
    ? doc(firestore, `psico/${data.chosenPsychologist.value}`)
    : undefined;
  const dataToSend = {
    instructor: instructorRef,
    ...data,
    rg: data.rg ?? "",
    // Persist psychologist reference in a normalized field
    psychologist: psychologistRef ?? null,
  };

  const docRef = await addDoc(collection(firestore, "students"), dataToSend);
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
};

const editUser = async (id: string | undefined, data: FieldValues) => {
  const firestore = getFirestore();
  const docRef = doc(firestore, `students/${id}`);
  const psychologistRef = data?.chosenPsychologist?.value
    ? doc(firestore, `psico/${data.chosenPsychologist.value}`)
    : null;
  await updateDoc(docRef, { ...data, psychologist: psychologistRef });
};

export { createUser, editUser };
