import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

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
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});