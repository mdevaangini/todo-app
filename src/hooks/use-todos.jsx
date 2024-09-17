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
//  *    '2024-09-01': [], // currentDate
 *    '2024-08-28': [{}, {}, {}, {}],
 * }
 *{
 *
 * '2024-09-09: [{}, {}, {}, {}]
 * }
 */
function getUncompletedTodosByDate(todos, currentDate) {
  const uncompletedTodosByDate = {};
  const days = Object.keys(todos);

  days.forEach((day) => {
    const uncompletedTodos = todos[day].filter((item) => !item.completed);
    if (uncompletedTodos.length > 0 && currentDate !== day) {
      uncompletedTodosByDate[day] = uncompletedTodos;
    }
  });

  return uncompletedTodosByDate;

  // return days.reduce((acc, day) => {
  //   const uncompletedTodos = todos[day].filter((item) => !item.completed);
  //   if (uncompletedTodos.length > 0) {
  //     acc[day] = uncompletedTodos;
  //   }
  //   return acc;
  // }, {});
}

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

  const deleteTodo = (id, date) => {
    const finalDate = date ?? currentDate;

    const updatedTodos = {
      ...todos,
      [finalDate]: todos[finalDate].filter((item) => {
        return item.id !== id;
      }),
    };

    updateSnapshot(updatedTodos);
  };

  const updateTodo = (todo, date) => {
    const finalDate = date ?? currentDate;

    const updatedTodo = {
      ...todos,
      [finalDate]: todos[finalDate].map((item) => {
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
    uncompletedTodosByDate: getUncompletedTodosByDate(todos, currentDate),
  };
}
