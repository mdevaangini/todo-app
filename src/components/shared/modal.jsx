import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IoIosClose } from "react-icons/io";
import PropTypes from "prop-types";

export function Modal({ children, open, onClose }) {
  const savedOnClose = useRef(onClose);

  useEffect(() => {
    savedOnClose.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event) {
      if (event.key === "Escape") savedOnClose.current();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="modal">
      <div className="modal__content">
        {children}
        <button className="modal__close-icon" type="button" onClick={onClose}>
          <IoIosClose fontSize={22} />
        </button>
      </div>
    </div>,
    document.body
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
};
