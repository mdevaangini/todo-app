import "./App.css";

import { useState } from "react";
import { useTodos } from "./hooks/use-todos";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { IoIosAdd } from "react-icons/io";
import { Modal } from "./components/shared/modal";
import { TodoList } from "./components/todo-list";
import { CustomInput } from "./components/custom-input";
import { format, isToday } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { todos, addTodo, updateTodo, deleteTodo, getDayClassName } = useTodos(
    format(currentDate, "yyyy-MM-dd")
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  useKeyboardShortcuts(setOpen);

  const editMode = selectedTodo !== null;

  const uncompletedTodos = todos.filter((i) => !i.completed);

  const completedTodos = todos.filter((i) => i.completed);

  function onClose() {
    setOpen(false);
    setSelectedTodo(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = formData.get("input");
    if (editMode) {
      const todo = { ...selectedTodo, title: input };
      updateTodo(todo);
    } else addTodo(input);

    onClose();
  }

  function handleCheck(item) {
    const todo = {
      ...item,
      completed: item.completed === true ? false : true,
    };
    updateTodo(todo);
  }

  function handleDelete(item) {
    deleteTodo(item.id);
  }

  function handleEdit(item) {
    setSelectedTodo(item);
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
              setCurrentDate(date);
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
        <button aria-label="add item" onClick={() => setOpen(true)}>
          <IoIosAdd fontSize={22} />
        </button>
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

      <Modal open={open || editMode} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <div className="form__input">
            <label htmlFor="title">
              Your title {editMode ? "(Update)" : ""}
            </label>
            <input
              id="title"
              name="input"
              placeholder="Enter here..."
              defaultValue={editMode ? selectedTodo.title : ""}
            />
          </div>
          <button type="submit">{editMode ? "Update" : "Submit"}</button>
        </form>
      </Modal>
    </main>
  );
}

export default App;
