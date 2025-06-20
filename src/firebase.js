import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1qG6KcYq-p3bOgFaO_ypMgSo15D2zHuU",
  authDomain: "mst-com.firebaseapp.com",
  projectId: "mst-com",
  storageBucket: "mst-com.appspot.com",
  messagingSenderId: "941531906965",
  appId: "1:941531906965:web:6ede067b306174e87e2c9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app; 