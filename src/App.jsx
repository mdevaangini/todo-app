import "./App.css";

import { Fragment, useEffect, useState } from "react";
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
import { useSearchParams } from "react-router-dom";
import { auth, db } from "./lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Toast } from "./components/shared/toast";

// client (browser, mobiel browser)
export async function fetchTodosForDay(day) {
  const docRef = doc(db, auth.currentUser.uid, day);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data()?.entries ?? [];
  }
  return [];
}

// server
function removeKey(obj, key) {
  const keys = Object.keys(obj).filter((item) => item !== key);

  const updatedObj = {};

  keys.forEach((key) => {
    updatedObj[key] = obj[key];
  });

  return updatedObj;
}

function App() {
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState({ todo: null, date: null });
  const [showPreviousItems, setshowPreviousItems] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  // const [show,setShow] = useS
  const [toast, setToast] = useState({
    message: null,
    status: null,
  });
  const show = toast.message && toast.status ? true : false;
  const currentDate =
    searchParams.get("day") ?? format(new Date(), "yyyy-MM-dd");
  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    getDayClassName,
    uncompletedTodosByDate: _uncompletedTodosByDate,
  } = useTodos(currentDate);
  const uncompletedTodosByDate = removeKey(
    _uncompletedTodosByDate,
    currentDate
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  useKeyboardShortcuts(setOpen);
  const editMode = selectedTodo.todo !== null;
  const uncompletedTodos = todos.filter((i) => !i.completed);

  const completedTodos = todos.filter((i) => i.completed);

  useEffect(() => {
    if (!toast.message || !toast.status) return;

    const timer = setTimeout(() => {
      setToast({
        message: null,
        status: null,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.message, toast.status]);

  function onClose() {
    setOpen(false);
    setSelectedTodo({ todo: null, date: null });
  }

  async function handleSubmit(e) {
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

  // async function handleLogout() {
  //   try {
  //     await signOut(auth);
  //     navigate("/login");
  //   } catch (error) {
  //     console.log("failed to signout", error);
  //   }
  // }

  useEffect(() => {
    fetchTodosForDay(currentDate).then(() => {});
  }, [currentDate]);

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
              const className = getDayClassName(date);
              return className;
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
          <button
            aria-label="add item"
            onClick={() => {
              setOpen(true);
              setToast({
                message: "Bye",
                status: "success",
              });
            }}
          >
            <IoIosAdd fontSize={22} />
          </button>
        </div>
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
      {show ? <Toast /> : null}
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
  const days = Object.keys(todosByDate).filter(
    (key) => todosByDate[key].length > 0
  );

  function handleClick(day) {
    const params = new URLSearchParams(searchParams);
    params.set("day", day);
    setSearchParams(params);
  }

  if (days.length == 0) return null;
  console.log("days", days);

  return (
    <section className="uncompleted-section">
      <h3>Previously Uncompleted Items</h3>
      {days.map((day) => {
        if (Number(todosByDate[day].length) === 0) return null;

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
