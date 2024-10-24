import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/router";

import "./index.css";
import "non.geist";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
