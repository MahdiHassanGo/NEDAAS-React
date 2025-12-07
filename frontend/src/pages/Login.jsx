// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function getDashboardPath(role) {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "director":
      return "/dashboard/director";
    case "advisor":
      return "/dashboard/advisor";
    case "lead":
      return "/dashboard/lead";
    case "member":
    default:
      return "/dashboard/member";
  }
}

export default function Login() {
  const { loginWithGoogle, firebaseUser, role, loading, authError } = useAuth();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(null); // "success" | "error"
  const [attemptedLogin, setAttemptedLogin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleLogin = async () => {
    setMessage("");
    setMessageType(null);
    setAttemptedLogin(true);

    try {
      await loginWithGoogle();
      // Backend + Firebase handled in AuthContext; we react in useEffect
    } catch (err) {
      setMessage("Login failed: " + (err.message || "Unknown error"));
      setMessageType("error");
    }
  };

  // After login success → redirect
  useEffect(() => {
    if (!loading && firebaseUser && role) {
      const path = getDashboardPath(role);

      setMessage("Login successful!");
      setMessageType("success");

      const from = location.state?.from?.pathname || path;
      navigate(from, { replace: true });
    }
  }, [loading, firebaseUser, role, navigate, location.state]);

  // Show login failed if backend login failed
  useEffect(() => {
    if (!loading && attemptedLogin && authError && !firebaseUser) {
      setMessage("Login failed: " + authError);
      setMessageType("error");
    }
  }, [loading, attemptedLogin, authError, firebaseUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-deepTeal mb-4 text-center">
          NEDAAS Lab Login
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Sign in to access your dashboard.
        </p>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg text-sm ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white font-medium hover:shadow-lg transition-shadow disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}
