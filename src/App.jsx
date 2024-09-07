import { useState } from "react";
import "./App.css";
import { useTodos } from "./hooks/use-todos";
import { IoIosAdd } from "react-icons/io";
import { Modal } from "./components/shared/modal";
import { TodoList } from "./components/todo-list";

function App() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const [open, setOpen] = useState(false);

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
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = formData.get("input");
    addTodo(input);
    setOpen(false);
  }

  function handleCheck(item) {
    const todo = {
      title: item.title,
      id: item.id,
      timestamp: item.timestamp,
      completed: item.completed === true ? false : true,
    };
    updateTodo(todo);
  }

  function handleDelete(item) {
    deleteTodo(item.id);
  }

  return (
    <main className="todos">
      <header className="header">
        <h1>
          <span className="heading__title">Today</span>
          <span className="heading__date">26 feb.</span>
        </h1>
        <button aria-label="add item" onClick={() => setOpen(true)}>
          <IoIosAdd fontSize={18} />
        </button>
      </header>

      {todos.length === 0 && <p className="todo__message">No Items...</p>}

      <TodoList
        list={uncompletedTodos}
        handleCheck={handleCheck}
        handleDelete={handleDelete}
      />

      {completedTodos.length !== 0 && (
        <section className="completed">
          <h3 className="completed__heading">Completed Items</h3>
          <TodoList
            list={completedTodos}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        </section>
      )}

      <Modal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <div className="form__input">
            <label htmlFor="title">Your title</label>
            <input id="title" name="input" placeholder="Enter here..." />
          </div>
          <button type="submit">Submit</button>
        </form>
      </Modal>
    </main>
  );
}

export default App;
