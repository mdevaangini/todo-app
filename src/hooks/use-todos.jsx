import { useEffect, useState } from "react";
import { add, format } from "date-fns";
import { auth, db } from "../lib/firebase";
import {
  setDoc,
  doc,
  arrayUnion,
  getDoc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { startOfMonth } from "date-fns";
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
  // const days = Object.keys(todos);

  // days.forEach((day) => {
  //   const uncompletedTodos = todos[day].filter((item) => !item.completed);
  //   if (uncompletedTodos.length > 0 && currentDate !== day) {
  //     uncompletedTodosByDate[day] = uncompletedTodos;
  //   }
  // });

  // return uncompletedTodosByDate;

  // return days.reduce((acc, day) => {
  //   const uncompletedTodos = todos[day].filter((item) => !item.completed);
  //   if (uncompletedTodos.length > 0) {
  //     acc[day] = uncompletedTodos;
  //   }
  //   return acc;
  // }, {});
}

// {
//   '22-12-2022': [],
//   '22-12-2022': [],
//   '22-12-2022': [],
//   '22-12-2022': [],
//   '22-12-2022': [],
// }

async function fetchTodosForDay(date) {
  const docRef = doc(db, auth.currentUser.uid, date);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data()?.entires ?? [];
  }
  return [];
}

export function useTodos(currentDate) {
  const [todos, setTodos] = useState([]);
  const [todoStatus, setTodoStatus] = useState({}); // {id: 'all-completed', 'has-uncompleted-items', 'empty'}

  // useEffect(() => {
  //   fetchTodosForDay(currentDate).then((todos) => {
  //     setTodos(todos);
  //   });
  // }, [currentDate]);
  // console.log("todos", todos);

  useEffect(() => {
    const startDate = startOfMonth(currentDate);
    // const startDateString = format(startDate, "yyyy-MM-dd");
    // const lastMonthDay = endOfMonth(currentDate);
    // const d1 = startDate.();
    let result = {};
    (async () => {
      for (let i = 1; i < 30; i++) {
        const targetDay = add(startDate, { days: i });
        const formattedTargetDay = format(targetDay, "yyyy-MM-dd");
        const data = await fetchTodosForDay(formattedTargetDay);
        result = { ...result, [formattedTargetDay]: getTodoStatus(data) };
      }
      setTodoStatus({ ...result });
    })();
    // const q = query(
    //   collection(db, auth.currentUser.uid),
    //   where("entries", "array-contains", { completed: true })
    // );
    // const querySnapshot = getDocs(q);
    // querySnapshot.forEach((doc) => console.log(doc.id));
  }, [currentDate]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, auth.currentUser.uid, currentDate),
      (doc) => {
        if (doc.exists()) setTodos(doc.data().entires);
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

    const docRef = doc(db, auth.currentUser.uid, currentDate);
    await setDoc(docRef, { entires: arrayUnion(todo) }, { merge: true });
  };

  const deleteTodo = (id, date) => {
    const finalDate = date ?? currentDate;
    const finalTodos = todos.filter((item) => {
      return item.id !== id;
    });
    const targetTodo = todos.find((item) => {
      return item.id === id;
    });

    setDoc(
      doc(db, auth.currentUser.uid, finalDate),
      { entires: arrayRemove(targetTodo) },
      { merge: true }
    );

    setTodos(finalTodos);
  };

  const updateTodo = (todo, date) => {
    const finalDate = date ?? currentDate;

    // const updatedTodo = {
    //   ...todos,
    //   [finalDate]: todos[finalDate].map((item) => {
    //     if (item.id === todo.id) return todo;
    //     else return item;
    //   }),
    // };

    const updatedTodo = todos.map((item) => {
      if (item.id === todo.id) return todo;
      else return item;
    });
    setTodos(updatedTodo);

    setDoc(doc(db, auth.currentUser.uid, finalDate), {
      entires: updatedTodo,
    });
  };

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
    uncompletedTodosByDate: getUncompletedTodosByDate(todos, currentDate),
  };
}
