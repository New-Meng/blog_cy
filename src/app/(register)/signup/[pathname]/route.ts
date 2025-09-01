import { NextResponse } from "next/server";

export async function GET(request: Request, params: { params: any }) {
  console.log(params, "++??");

  // params 获取动态路劲，查询参数用下面方式获取
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  let randomNumber = Math.random();
  const data = `{msg: 200， id: ${id}}`;

  return NextResponse.json({ data });
}

// post请求
export async function POST(request: Request, params: { params: any }) {
  console.log("POST 请求");
  const data = `{data:1111}`;
  return NextResponse.json({ data });
}
