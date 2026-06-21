import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app = null;
let auth = null;

// Only initialize if we have config
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_api_key') {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export const signInWithGoogle = async () => {
  if (!auth) {
    console.warn("Firebase not configured. Using mock sign in.");
    return { user: { displayName: 'Mock User', email: 'mock@example.com' } };
  }
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signOutUser = async () => {
  if (!auth) return;
  return firebaseSignOut(auth);
};

export const onAuthChange = (callback) => {
  if (!auth) {
    // If no firebase, just return a dummy unsubscribe function
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// Mock functions for Firestore
export const saveScan = async (userId, scanData) => {
  console.log('Mock saveScan:', scanData);
  return Promise.resolve();
};

export const getScans = async (userId) => {
  return Promise.resolve([]);
};
