"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import {
  auth,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
} from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      console.log("Attempting Google sign in from context");
      const result = await signInWithGoogle();
      console.log("Google sign in successful in context:", result);
      return result;
    } catch (error) {
      console.error("Google sign in error in context:", error);
      throw error;
    }
  };

  const handleSignInWithEmail = async (email: string, password: string) => {
    try {
      console.log("Attempting email sign in from context");
      const result = await signInWithEmail(email, password);
      console.log("Email sign in successful in context:", result);
      return result;
    } catch (error) {
      console.error("Email sign in error in context:", error);
      throw error;
    }
  };

  const handleSignUpWithEmail = async (email: string, password: string) => {
    try {
      console.log("Attempting email sign up from context");
      const result = await signUpWithEmail(email, password);
      console.log("Email sign up successful in context:", result);
      return result;
    } catch (error) {
      console.error("Email sign up error in context:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("Attempting sign out from context");
      await signOutUser();
      console.log("Sign out successful in context");
    } catch (error) {
      console.error("Sign out error in context:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
