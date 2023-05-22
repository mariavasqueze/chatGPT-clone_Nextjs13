import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKvy1rZe3IEYKhdnbzC4iDzD3sxNqNREU",
  authDomain: "chatgpt-project-f8ab9.firebaseapp.com",
  projectId: "chatgpt-project-f8ab9",
  storageBucket: "chatgpt-project-f8ab9.appspot.com",
  messagingSenderId: "377432852240",
  appId: "1:377432852240:web:3b6d5b8eba761ee7864795",
  measurementId: "G-BTVZP9F2P9",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
