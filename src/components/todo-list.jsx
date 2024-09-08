import PropTypes from "prop-types";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";

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
              <span className="list__timestamp">{item.timestamp}</span>
            </div>
            <button
              aria-label="edit"
              className="list__btn"
              onClick={() => {
                handleEdit(item);
              }}
            >
              <CiEdit fontSize={20} />
            </button>
            <button
              aria-label="delete"
              className="list__btn"
              onClick={() => {
                handleDelete(item);
              }}
            >
              <AiOutlineDelete fontSize={18} />
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
