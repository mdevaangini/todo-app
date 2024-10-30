import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import App from "../App";
import { LoginPage } from "../pages/auth/login-page";
import { SignUpPage } from "../pages/auth/signup-page";
import { auth as firebaseAuth } from "../lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export const router = createBrowserRouter([
  {
    element: <AuthMiddleware auth="allow-with-auth" />,
    children: [{ path: "/", element: <App /> }],
  },
  {
    element: <AuthMiddleware auth="allow-without-auth" />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
    ],
  },
]);

function AuthMiddleware({ auth }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setLoading(false);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;

  if (auth === "allow-with-auth" && !user?.emailVerified)
    return <Navigate to="/login" />; // example, home-page etc
  if (auth === "allow-without-auth" && user?.emailVerified)
    return <Navigate to="/" />; // example, signup,login etc
  return <Outlet />;
}
