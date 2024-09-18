import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// Optionally import the services that you want to use
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCIMDwRNR9DywOPz0u1oTxF-fP7HoYPsco",
    authDomain: "agoravai-v2.firebaseapp.com",
    projectId: "agoravai-v2",
    storageBucket: "agoravai-v2.appspot.com",
    messagingSenderId: "837982586529",
    appId: "1:837982586529:web:2d9e733cd2bd338f7d92e0",
    measurementId: "G-HB4RNTBFP0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);