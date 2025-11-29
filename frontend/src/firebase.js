import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAhPIn05tVqrMqmaAVCUntY_9Cvd_REjMs",
  authDomain: "nedaas-bf431.firebaseapp.com",
  projectId: "nedaas-bf431",
  storageBucket: "nedaas-bf431.firebasestorage.app",
  messagingSenderId: "661669252766",
  appId: "1:661669252766:web:481408deda13f78618758f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;

