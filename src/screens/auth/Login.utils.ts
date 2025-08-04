import { signInWithEmailAndPassword, User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/src/config/firebaseConfig";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { FieldValues } from "react-hook-form";
import { errorMessages } from "@/src/utils/errorMessages";

const ensureInstructorAuthUid = async (user: User) => {
  const firestore = getFirestore();
  // 1) already have doc with id == uid?
  const directRef = doc(firestore, `instructors/${user.uid}`);
  const directSnap = await getDoc(directRef);
  if (directSnap.exists()) {
    // guarantee field authUid
    if (!directSnap.data().authUid) {
      await updateDoc(directRef, { authUid: user.uid });
    }
    return;
  }
  // 2) search by authUid field
  const colRef = collection(firestore, "instructors");
  const q1 = query(colRef, where("authUid", "==", user.uid));
  const qs1 = await getDocs(q1);
  if (!qs1.empty) return; // already mapped

  // 3) search by email (legacy)
  if (user.email) {
    const q2 = query(colRef, where("email", "==", user.email));
    const qs2 = await getDocs(q2);
    if (!qs2.empty) {
      await updateDoc(qs2.docs[0].ref, { authUid: user.uid });
      return;
    }
  }
  // 4) create minimal instructor document with uid as id
  await setDoc(directRef, {
    authUid: user.uid,
    email: user.email ?? "",
    name: user.displayName ?? "",
    createdAt: new Date(),
  });
};

const loginUser = async (data: FieldValues) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    console.log("=== LOGIN DEBUG ===");
    console.log("User UID:", userCredential.user.uid);
    console.log("User Email:", userCredential.user.email);
    console.log("==================");

    await ensureInstructorAuthUid(userCredential.user);
    
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const errorMessage = errorMessages[firebaseError.code] || "Erro desconhecido";
    return {
      success: false,
      errorMessage,
    };
  }
};

export { loginUser };