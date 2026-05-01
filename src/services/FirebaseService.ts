import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBCvrRFCaOR5LAa6_-JHVHtLTI_w788vio",
  authDomain: "game-guardian-7d0e7.firebaseapp.com",
  projectId: "game-guardian-7d0e7",
  storageBucket: "game-guardian-7d0e7.firebasestorage.app",
  messagingSenderId: "820833064915",
  appId: "1:820833064915:web:96f5621d2816a130040126"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;