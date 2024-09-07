import { useState } from "react";

export function useTodos() {
  const [todos, setTodos] = useState(() => {
    const initialTodos = localStorage.getItem("todos");
    if (!initialTodos) return [];

    return JSON.parse(initialTodos);
  });

  const addTodo = (title) => {
    const todo = {
      title: title,
      id: Date.now(),
      timestamp: Date.now(),
      completed: false,
    };

    const updatedTodos = [...todos, todo];
    updateSnapshot(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodo = todos.filter((item) => {
      return item.id !== id;
    });

    updateSnapshot(updatedTodo);
  };

  const updateTodo = (todo) => {
    const updatedTodo = todos.map((item) => {
      if (item.id === todo.id) return todo;
      else return item;
    });

    updateSnapshot(updatedTodo);
  };

  function updateSnapshot(todos) {
    setTodos(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  return { todos, addTodo, updateTodo, deleteTodo };
}
