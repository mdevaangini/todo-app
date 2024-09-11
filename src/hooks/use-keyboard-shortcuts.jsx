import { useEffect } from "react";

export function useKeyboardShortcuts(setOpen) {
  useEffect(() => {
    const handleChange = (event) => {
      event.preventDefault();
      if (event.ctrlKey && event.key === "o") {
        setOpen(true);
      }
      if (event.metaKey && event.key === "o") {
        setOpen(true);
      }
    };
    document.body.addEventListener("keydown", handleChange);
    return () => {
      document.body.removeEventListener("keydown", handleChange);
    };
  }, [setOpen]);
}
