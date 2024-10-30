import styles from "./toast.module.css";
import { IoIosClose } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";
import { MdOutlineErrorOutline } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { useToast } from "../toast-provider";

const StatusIconMapping = {
  success: CiCircleCheck,
  warning: IoWarningOutline,
  error: MdOutlineErrorOutline,
};

export function Toast({ message, status = "success" }) {
  const Icon = StatusIconMapping[status.toLowerCase()];

  const setToast = useToast();
  return (
    <div className={`${styles.toast} ${styles[`toast--${status}`]}`}>
      <div>{<Icon fontSize={22} />}</div>
      <span>{message}</span>
      <button
        className="list__btn"
        onClick={() => {
          setToast({ message: null, status: null });
        }}
      >
        <IoIosClose fontSize={28} />
      </button>
    </div>
  );
}
