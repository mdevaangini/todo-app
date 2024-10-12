import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0FH2vTm3OieQsYb0_y4-aHbUoufp6eAQ",
  authDomain: "todos-cf6d8.firebaseapp.com",
  projectId: "todos-cf6d8",
  storageBucket: "todos-cf6d8.appspot.com",
  messagingSenderId: "232455950906",
  appId: "1:232455950906:web:7a8215144a19a72563db03",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
