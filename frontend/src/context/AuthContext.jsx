import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { loginWithFirebaseToken, getCurrentUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const performBackendLogin = async (user) => {
    try {
      setLoading(true);
      setAuthError(null);

      const idToken = await user.getIdToken(true);

      // login / sync backend user
      await loginWithFirebaseToken(idToken);

      // fetch actual DB user with actual role
      const currentUser = await getCurrentUser(idToken);

      setBackendUser(currentUser);
      setRole(currentUser?.role || null);
    } catch (err) {
      console.error("Backend login failed:", err);
      setBackendUser(null);
      setRole(null);
      setAuthError(err.message || "Backend login failed");

      await signOut(auth);
      setFirebaseUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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

      try {
        await performBackendLogin(user);
      } catch {
        // already handled above
      }
    });

    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    setFirebaseUser(user);
    await performBackendLogin(user);
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