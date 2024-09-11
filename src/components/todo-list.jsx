import PropTypes from "prop-types";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { format } from "date-fns";

export function TodoList({ list, handleCheck, handleDelete, handleEdit }) {
  return (
    <ul className="list">
      {list.map((item) => {
        return (
          <li className="list__item" key={item.id}>
            <button
              aria-label={item.completed ? "uncheck" : "check"}
              className="list__btn-wrapper"
              onClick={() => handleCheck(item)}
            />
            {item.completed ? (
              <span className="list__marker list__marker--checked"></span>
            ) : (
              <span className="list__marker"></span>
            )}
            <div className="list__content">
              <span className="list__title" key={item.id}>
                {item.title}
              </span>
              <span className="list__timestamp">
                {format(item.timestamp, "hh:mm aaaa")}
              </span>
            </div>
            <button
              aria-label="edit"
              className="list__btn"
              onClick={() => {
                handleEdit(item);
              }}
            >
              <CiEdit />
            </button>
            <button
              aria-label="delete"
              className="list__btn"
              onClick={() => {
                handleDelete(item);
              }}
            >
              <AiOutlineDelete />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

TodoList.propTypes = {
  list: PropTypes.array,
  handleCheck: PropTypes.func,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
};
