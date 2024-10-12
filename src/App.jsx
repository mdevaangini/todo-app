import "./App.css";

import { Fragment, useState } from "react";
import { useTodos } from "./hooks/use-todos";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { IoIosAdd } from "react-icons/io";
import { Modal } from "./components/shared/modal";
import { TodoList } from "./components/todo-list";
import { CustomInput } from "./components/custom-input";
import { format, isToday } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./lib/firebase";

function App() {
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState({ todo: null, date: null });
  const [showPreviousItems, setshowPreviousItems] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentDate =
    searchParams.get("day") ?? format(new Date(), "yyyy-MM-dd");
  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    getDayClassName,
    uncompletedTodosByDate,
  } = useTodos(currentDate);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const navigate = useNavigate();
  useKeyboardShortcuts(setOpen);
  const editMode = selectedTodo.todo !== null;
  const uncompletedTodos = todos.filter((i) => !i.completed);

  const completedTodos = todos.filter((i) => i.completed);

  function onClose() {
    setOpen(false);
    setSelectedTodo({ todo: null, date: null });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = formData.get("input");
    if (editMode) {
      const todo = { ...selectedTodo.todo, title: input };
      updateTodo(todo, selectedTodo.date);
    } else addTodo(input);

    onClose();
  }

  function handleCheck(item, date) {
    const todo = {
      ...item,
      completed: item.completed === true ? false : true,
    };
    updateTodo(todo, date);
  }

  function handleDelete(item, date) {
    deleteTodo(item.id, date);
  }

  function handleEdit(item, date) {
    setSelectedTodo({ todo: item, date });
  }

  function handleToggle() {
    setshowPreviousItems(!showPreviousItems);
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log("failed to signout", error);
    }
  }

  return (
    <main className="todos">
      <header className="header">
        <h1>
          <span className="heading__title">
            {isToday(currentDate) ? "Today" : "On"}
          </span>
          <DatePicker
            selected={currentDate}
            onChange={(date) => {
              const params = new URLSearchParams(searchParams);
              params.set("day", format(date, "yyyy-MM-dd"));
              setSearchParams(params);
            }}
            customInput={<CustomInput open={datePickerOpen} />}
            dayClassName={(date) => {
              return getDayClassName(date);
            }}
            onCalendarClose={() => {
              setDatePickerOpen(false);
            }}
            onCalendarOpen={() => {
              setDatePickerOpen(true);
            }}
          />
        </h1>

        <div className="heading__toolbar">
          {Object.keys(uncompletedTodosByDate).length !== 0 && (
            <button onClick={handleToggle} className="heading__toggle-button">
              {showPreviousItems ? "Hide" : "Show"} More Items
            </button>
          )}
          <button aria-label="add item" onClick={() => setOpen(true)}>
            <IoIosAdd fontSize={22} />
          </button>
        </div>
        <button onClick={handleLogout}>logout</button>
      </header>

      {todos.length === 0 && <p className="todo__message">No Items...</p>}

      <TodoList
        list={uncompletedTodos}
        handleCheck={handleCheck}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {completedTodos.length !== 0 && (
        <section className="completed">
          <h3 className="completed__heading">Completed Items</h3>
          <TodoList
            list={completedTodos}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </section>
      )}

      {showPreviousItems && (
        <PreviousUncompletedTodosSection
          todosByDate={uncompletedTodosByDate}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      )}

      <Modal open={open || editMode} onClose={onClose}>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__input">
            <label htmlFor="title">
              Your title {editMode ? "(Update)" : ""}
            </label>
            <input
              id="title"
              required
              name="input"
              placeholder="Enter here..."
              defaultValue={editMode ? selectedTodo.todo.title : ""}
            />
          </div>
          <button type="submit">{editMode ? "Update" : "Submit"}</button>
        </form>
      </Modal>
    </main>
  );
}

export default App;

function PreviousUncompletedTodosSection({
  todosByDate,
  handleCheck,
  handleDelete,
  handleEdit,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const days = Object.keys(todosByDate);

  function handleClick(day) {
    const params = new URLSearchParams(searchParams);
    params.set("day", day);
    setSearchParams(params);
  }

  if (days.length == 0) return null;

  return (
    <section className="uncompleted-section">
      <h3>Previously Uncompleted Items</h3>
      {days.map((day) => {
        return (
          <Fragment key={day}>
            <div className="uncompleted-section__heading">
              <h4>{format(day, "dd MMM")}</h4>
              <button onClick={() => handleClick(day)}>
                <LiaExternalLinkAltSolid fontSize={16} />
              </button>
            </div>
            <TodoList
              list={todosByDate[day]}
              handleCheck={handleCheck}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              date={day}
            />
          </Fragment>
        );
      })}
    </section>
  );
}

PreviousUncompletedTodosSection.propTypes = {
  todosByDate: PropTypes.object,
  handleCheck: PropTypes.func,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
};
