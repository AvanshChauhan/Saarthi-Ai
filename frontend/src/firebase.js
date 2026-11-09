import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "automateaiproject.firebaseapp.com",
  projectId: "automateaiproject",
  storageBucket: "automateaiproject.firebasestorage.app",
  messagingSenderId: "179628309151",
  appId: "1:179628309151:web:6fda4302a7bb7e2cac00aa"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

///yt 1:45
