import { useEffect, useState } from "react";
import { format } from "date-fns";
import { auth, db } from "../lib/firebase";
import {
  setDoc,
  doc,
  arrayRemove,
  onSnapshot,
  collection,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { fetchTodosForDay } from "../App";
import { useToast } from "../components/shared/toast-provider";

export function useTodos(currentDate) {
  const [todos, setTodos] = useState([]);
  const [todoStatus, setTodoStatus] = useState({});
  const [uncompletedTodos, setUncompletedTodos] = useState({});

  const showToast = useToast();
  useEffect(() => {
    const collectionRef = collection(db, auth.currentUser.uid);

    getDocs(collectionRef).then((docs) => {
      const result = {};
      const uncompletedTodosByDate = {};

      docs.forEach((doc) => {
        if (!doc.exists()) return;
        const data = doc.data()?.entries ?? [];
        result[doc.id] = getTodoStatus(data);
        const uncompletedTodos = data.filter((item) => !item.completed);
        if (uncompletedTodos.length === 0) return;
        uncompletedTodosByDate[doc.id] = uncompletedTodos;
      });

      setTodoStatus(result);
      setUncompletedTodos(uncompletedTodosByDate);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, auth.currentUser.uid, currentDate),
      (doc) => {
        if (doc.exists()) setTodos(doc.data().entries);
        else setTodos([]);
      }
    );
    return () => unsubscribe();
  }, [currentDate]);

  const addTodo = async (title) => {
    const todo = {
      title: title,
      id: Date.now(),
      timestamp: Date.now(),
      completed: false,
    };

    const newTodos = [...todos, todo];
    setTodos(newTodos);
    await updateTodosSideEffect(newTodos, currentDate, { skipDBUpdate: true });
    await setDoc(
      doc(db, auth.currentUser.uid, currentDate),
      { entries: arrayUnion(todo) },
      { merge: true }
    );
  };

  const deleteTodo = async (id, date) => {
    try {
      const finalDate = date ?? currentDate;
      const finalTodos = todos.filter((item) => {
        return item.id !== id;
      });
      const targetTodo = todos.find((item) => {
        return item.id === id;
      });
      setTodos(finalTodos);

      await setDoc(
        doc(db, auth.currentUser.uid, finalDate),
        { entries: arrayRemove(targetTodo) },
        { merge: true }
      );
      showToast({ message: "Item Deleted Successfully!", status: "success" });
    } catch (error) {
      const defaultMessage = "Failed to delete item";
      const message = error.message ?? defaultMessage;
      showToast({ message, status: "error" });
    }
  };

  const updateTodo = async (todo, date) => {
    try {
      const finalDate = date ?? currentDate;

      if (date === currentDate) {
        const updatedTodo = todos.map((item) => {
          if (item.id === todo.id) return todo;
          else return item;
        });
        setTodos(updatedTodo);
        await updateTodosSideEffect(updatedTodo, finalDate);
      } else {
        const targetTodos = await fetchTodosForDay(finalDate);
        const updatedTodo = targetTodos.map((item) => {
          if (item.id === todo.id) return todo;
          return item;
        });
        await updateTodosSideEffect(updatedTodo, finalDate);
      }
      showToast({ message: "Item Updated Successfully!", status: "success" });
    } catch (error) {
      const defaultMessage = "Failed to update item";
      const message = error.message ?? defaultMessage;
      showToast({ message, status: "error" });
    }
  };

  function updateTodosSideEffect(todos, date, options = {}) {
    const result = { ...todoStatus, [date]: getTodoStatus(todos) };
    const updatedUncompletedTodos = todos.filter((item) => !item.completed);
    const updatedUncompletedTodosByDate = {
      ...uncompletedTodos,
      [date]: updatedUncompletedTodos,
    };
    setTodoStatus(result);
    console.log("uncompletedtodos", updatedUncompletedTodosByDate);
    setUncompletedTodos(updatedUncompletedTodosByDate);
    if (!options.skipDBUpdate)
      setDoc(doc(db, auth.currentUser.uid, date), {
        entries: todos,
      });
  }

  function getTodoStatus(items) {
    if (items.length === 0) return "";

    const areAllItemsCompleted = items.every((item) => item.completed);
    if (areAllItemsCompleted) return "day--completed";
    return "day--uncompleted";
  }

  function getDayClassName(date) {
    const formattedDate = format(date, "yyyy-MM-dd");
    return todoStatus[formattedDate] ?? "";

    // // const items = await fetchTodosForDay(formattedDate);
    // if (items.length === 0) return "";

    // const areAllItemsCompleted = items.every((item) => item.completed);
    // if (areAllItemsCompleted) return "day--completed";

    // return "day--uncompleted";
  }

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    getDayClassName,
    uncompletedTodosByDate: uncompletedTodos,
  };
}
