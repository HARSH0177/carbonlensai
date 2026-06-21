import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithGoogle, signOutUser, onAuthChange } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsGuest(false);
      } else if (!isGuest) {
        setUser(null);
      }
      setLoading(false);
    });

    // If onAuthChange returns immediately because firebase isn't configured
    setLoading(false);

    return () => unsubscribe();
  }, [isGuest]);

  const signIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        setUser(result.user);
        setIsGuest(false);
      }
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    const mockGuestUser = {
      displayName: 'Explorer',
      email: 'guest@carbonlens.ai',
      photoURL: null,
      uid: 'guest-' + Date.now()
    };
    setUser(mockGuestUser);
    setIsGuest(true);
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await signOutUser();
      setUser(null);
      setIsGuest(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, signIn, signOut, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
