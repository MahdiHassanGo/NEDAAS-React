// src/components/Auth/LoginButton.jsx
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";

const provider = new GoogleAuthProvider();

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // after this, AuthContext effect will handle backend login
    } catch (error) {
      console.error("Firebase login error:", error);
    }
  };

  return (
    <button onClick={handleLogin}>
      Login with Google
    </button>
  );
}
