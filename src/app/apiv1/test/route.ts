import { NextResponse } from "next/server";

import prisma from "@/app/lib/server/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  // params中，取动态参数，是动态的

  return NextResponse.json({ code: 404, data: "错误的访问" });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const body = await request.json();

  return NextResponse.json({
    data: "注册成功!",
    body: body,
  });

  console.log("POST 请求");
  return new Response("Not Found", { status: 404 });
}
