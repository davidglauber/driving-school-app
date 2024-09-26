import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/src/config/firebaseConfig";
import { FieldValues } from "react-hook-form";
import { errorMessages } from "@/src/utils/errorMessages";

const loginUser = async (data: FieldValues) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
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