import { useState } from "react";
import { format } from "date-fns";
/**
 *  interface Todo {
 *      title: string
 *      id: number
 *      timestamp: number
 *      completed: boolean
 *  }
 * type Todos = Record<string, Todos[]>
 * [{}],
 * {
 *    '2024-09-09': [{}, {}, {}, {}],
 *    '2024-09-01': [{}, {}, {}, {}],
 *    '2024-08-28': [{}, {}, {}, {}],
 * }
 */

export function useTodos(currentDate) {
  const [todos, setTodos] = useState(() => {
    const initialTodos = localStorage.getItem("todos");
    if (!initialTodos) return {};

    return JSON.parse(initialTodos);
  });

  const currentDayTodos = todos[currentDate] ?? [];

  const addTodo = (title) => {
    const todo = {
      title: title,
      id: Date.now(),
      timestamp: Date.now(),
      completed: false,
    };

    const existingTodos = todos[currentDate] ?? [];
    const updatedTodos = {
      ...todos,
      [currentDate]: [...existingTodos, todo],
    };

    updateSnapshot(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = {
      ...todos,
      [currentDate]: todos[currentDate].filter((item) => {
        return item.id !== id;
      }),
    };

    updateSnapshot(updatedTodos);
  };

  const updateTodo = (todo) => {
    const updatedTodo = {
      ...todos,
      [currentDate]: todos[currentDate].map((item) => {
        if (item.id === todo.id) return todo;
        else return item;
      }),
    };

    updateSnapshot(updatedTodo);
  };

  function updateSnapshot(todos) {
    setTodos(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function getDayClassName(date) {
    const formattedDate = format(date, "yyyy-MM-dd");

    const items = todos[formattedDate] ?? [];

    if (items.length === 0) return "";

    const areAllItemsCompleted = items.every((item) => item.completed);
    if (areAllItemsCompleted) return "day--completed";

    return "day--uncompleted";
  }

  return {
    todos: currentDayTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    getDayClassName,
  };
}
