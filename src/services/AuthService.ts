import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './FirebaseService';

export interface User {
  id: string;
  name: string;
  email: string;
}

const AuthService = {
  login: async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    return {
      id: user.uid,
      name: user.displayName || email.split('@')[0],
      email: user.email || email,
    };
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
    });
    return {
      id: user.uid,
      name,
      email,
    };
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  getCurrentUser: async (): Promise<User | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    return {
      id: user.uid,
      name: user.displayName || '',
      email: user.email || '',
    };
  },

  isAuthenticated: async (): Promise<boolean> => {
    return new Promise(resolve => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe();
        resolve(!!user);
      });
    });
  },
};

export default AuthService;