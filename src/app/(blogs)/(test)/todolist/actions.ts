"use server";

import { revalidatePath } from "next/cache";

const data = ["阅读", "写作", "冥想"];

// server actions 的本质，就是服务端生成函数，客户端只保留函数签名
// 当方法触发时，会调用post请求，传入函数签名，服务端根据函数签名，来调用对应的服务端存放的函数
export async function findToDos() {
  return data;
}

export async function createToDo(formData: FormData) {
  const todo = formData.get("todo");
  if (typeof todo === "string") {
    data.push(todo);
  }

  // revalidatePath("/todolist");
  return data;
}
