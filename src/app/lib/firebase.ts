import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDh_eoiZVoyltW4ZTYprdSRXGk3DHe1GpU",
  authDomain: "recap-25951.firebaseapp.com",
  projectId: "recap-25951",
  storageBucket: "recap-25951.firebasestorage.app",
  messagingSenderId: "722002243340",
  appId: "1:722002243340:web:665559af8256fa05f26329",
  measurementId: "G-ZH5LQN2N17",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence);
