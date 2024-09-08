import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IoIosClose } from "react-icons/io";
import PropTypes from "prop-types";
import FocusLock from "react-focus-lock";

export function Modal({ children, open, onClose }) {
  const savedOnClose = useRef(onClose);

  useEffect(() => {
    savedOnClose.current = onClose;
  }, [onClose]);

  /**
   * This effect is responsible for handling escape key
   */
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

  /**
   * This effect is responsible for handling scroll functionality
   */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <FocusLock returnFocus>
      <div className="modal">
        <div className="modal__content">
          {children}
          <button className="modal__close-icon" type="button" onClick={onClose}>
            <IoIosClose fontSize={22} />
          </button>
        </div>
      </div>
    </FocusLock>,
    document.body
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
};
