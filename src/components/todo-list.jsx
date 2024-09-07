import PropTypes from "prop-types";
import { AiOutlineDelete } from "react-icons/ai";

export function TodoList({ list, handleCheck, handleDelete }) {
  return (
    <ul className="list">
      {list.map((item) => {
        return (
          <li
            className="list__item"
            key={item.id}
            onClick={() => {
              handleCheck(item);
            }}
          >
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
              onClick={(event) => {
                event.stopPropagation();
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
};
