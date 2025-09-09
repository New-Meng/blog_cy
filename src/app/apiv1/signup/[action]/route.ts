import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { action: string } }
) {}

export async function POST(
  request: Request,
  { params }: { params: { action: string } }
) {
  const { action } = params;
  const body = await request.json();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (action == "register") {
    return NextResponse.json({
      data: "注册成功!",
      query: { userId: userId },
      body: body,
    });
  }

  console.log("POST 请求");
  const data = `{data:1111}`;
  return new Response("Not Found", { status: 404 });
}
