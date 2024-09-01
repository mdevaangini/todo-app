import { useState } from "react";
import "./App.css";
import User from "./User.jsx";

function App() {
  return (
    <>
      <div>
        {/* <h1>To-do App</h1> */}
        <User></User>{" "}
      </div>
    </>
  );
}

function useTodos() {
  const [todos, setTodos] = useState([]);

  const addTodo = (title) => {
    const todo = {
      title: title,
      id: Date.now(),
      timestamp: Date.now(),
      completed: false,
    };

    const updatedTodos = [...todos, todo];
    setTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodo = todos.filter((item) => {
      return item.id !== id;
    });

    setTodos(updatedTodo);
  };

  const updateTodo = (todo) => {
    const updatedTodo = todos.map((item) => {
      if (item.id === todo.id) return todo;
      else return item;
    });

    setTodos(updatedTodo);
  };

  return { todos, addTodo, updateTodo, deleteTodo };
}

export default App;
