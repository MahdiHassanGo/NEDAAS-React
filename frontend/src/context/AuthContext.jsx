// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { loginWithFirebaseToken } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Helper to call backend with Firebase ID token
  const performBackendLogin = async (user) => {
    try {
      setLoading(true);
      setAuthError(null);

      const idToken = await user.getIdToken();
      const data = await loginWithFirebaseToken(idToken);

      setBackendUser(data.user);
      setRole(data.role || "member");
      setAuthError(null);
    } catch (err) {
      console.error("Backend login failed:", err);
      setBackendUser(null);
      setRole(null);
      setAuthError(err.message || "Backend login failed");

      // If backend fails, also sign out from Firebase
      await signOut(auth);
      setFirebaseUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Listen to Firebase auth state (page reload + initial load)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFirebaseUser(null);
        setBackendUser(null);
        setRole(null);
        setAuthError(null);
        setLoading(false);
        return;
      }

      setFirebaseUser(user);
      await performBackendLogin(user);
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Called from Login page
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setFirebaseUser(user);
      await performBackendLogin(user);
    } catch (err) {
      console.error("Firebase login error:", err);
      setAuthError(err.message || "Login failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } finally {
      setFirebaseUser(null);
      setBackendUser(null);
      setRole(null);
      setAuthError(null);
    }
  };

  const value = {
    firebaseUser,
    backendUser,
    role,
    loading,
    authError,
    loginWithGoogle,
    logout,
    isAdmin: role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
