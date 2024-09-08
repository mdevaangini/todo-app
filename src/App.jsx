import { useState } from "react";
import "./App.css";
import { useTodos } from "./hooks/use-todos";
import { IoIosAdd } from "react-icons/io";
import { Modal } from "./components/shared/modal";
import { TodoList } from "./components/todo-list";

function App() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const editMode = selectedTodo !== null;

  const uncompletedTodos = todos.filter((i) => {
    if (i.completed === true) return false;
    else return true;
  });

  const completedTodos = todos.filter((i) => {
    if (i.completed === true) return true;
    else return false;
  });

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
          <span className="heading__title">Today</span>
          <span className="heading__date">26 feb.</span>
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
