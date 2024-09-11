import { forwardRef } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

export const CustomInput = forwardRef(function CustomInput(
  // eslint-disable-next-line no-unused-vars
  { value, className, open, ...rest },
  ref
) {
  return (
    <button className="heading__date" {...rest} ref={ref}>
      <span>{format(value, "dd MMM")}</span>
      {open ? <FaCaretUp fontSize={16} /> : <FaCaretDown fontSize={16} />}
    </button>
  );
});

CustomInput.propTypes = {
  value: PropTypes.any,
  className: PropTypes.string,
  open: PropTypes.bool,
};
