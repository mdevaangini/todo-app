import { useEffect } from "react";

export function useKeyboardShortcuts(setOpen) {
  useEffect(() => {
    const handleChange = (event) => {
      if (event.ctrlKey && event.key === "o") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.metaKey && event.key === "o") {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.body.addEventListener("keydown", handleChange);

    return () => {
      document.body.removeEventListener("keydown", handleChange);
    };
  }, [setOpen]);
}
