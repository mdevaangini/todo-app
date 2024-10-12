import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export function useAuthStateChanged() {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
      else navigate("/login");
    });

    return () => unsubscribe();
  }, [navigate]);
}
