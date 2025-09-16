"use client";
import { useEffect, useState } from "react";
import { findToDos, createToDo } from "./actions";

const TodoList = () => {
  const [todos, setTodos] = useState<string[]>([]);

  const load = async () => {
    const res = await findToDos();
    setTodos(res);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (formData: FormData) => {
    await createToDo(formData);
    findToDos().then((res) => {
      console.log(res, "++??res");
      setTodos(res);
    });
  };

  return (
    <>
      <form action={submit}>
        <input type="text" name="todo" />
        <button type="submit">add</button>
      </form>

      {todos &&
        todos?.map((item: string, index) => {
          return <div key={index}>{item}</div>;
        })}
    </>
  );
};

export default TodoList;
