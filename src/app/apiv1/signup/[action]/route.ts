import { NextResponse } from "next/server";
import { withApiHandler } from "@/app/lib/server/api-handler";
import { CreateUserDto } from "@/types/UserTypes/index";
import { Prisma } from "@prisma/client";

import prisma from "@/app/lib/server/db";

import { hash } from "bcryptjs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  // params中，取动态参数，是动态的
  const { action } = await params;
  console.log(action, "++??action");
  switch (action) {
    case "get":
      return NextResponse.json({ code: 404, data: "错误的访问" });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;
  let body: CreateUserDto | null = null;
  try {
    body = await request.json();
  } catch (error) {}

  const { searchParams } = new URL(request.url);

  switch (action) {
    case "register":
      try {
        const res = await prisma.user.findUnique({
          where: {
            email: body?.email,
          },
        });
        if (res) {
          return withApiHandler(() =>
            Promise.reject(new Error("当前邮箱已经注册过了，请直接登录"))
          );
        } else {
          if (!body?.email) {
            return withApiHandler(() =>
              Promise.reject(new Error("用户邮箱必须填写！"))
            );
          } else if (!body.username) {
            return withApiHandler(() =>
              Promise.reject(new Error("用户名称必须填写！"))
            );
          } else if (body.againPassword !== body.password) {
            return withApiHandler(() =>
              Promise.reject(new Error("两次密码不一致！"))
            );
          }

          try {
            const hashpassword = await hash(body.againPassword, 10);
            await prisma.user.create({
              data: {
                email: body.email,
                username: body.username,
                password: body.password,
                hashpassword: hashpassword,
              },
            });
            return withApiHandler(() => Promise.resolve(null), "注册成功!");
          } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
              if (error && error?.code === "P2002") {
                const targetField = (error?.meta?.target as string).split(
                  "_"
                )?.[1];
                let errorText = "";
                if (targetField === "username") {
                  errorText = "用户名称已经存在!";
                } else if (targetField === "mobile") {
                  errorText = "用户邮箱已经注册，请直接登录!";
                }
                return withApiHandler(() =>
                  Promise.reject(new Error(errorText))
                );
              }
            return withApiHandler(() => Promise.reject(error));
          }
        }
      } catch (error) {
        return withApiHandler(() => Promise.reject(new Error("未捕获的异常")));
      }

    default:
      return withApiHandler(
        () => Promise.reject(new Error("Not Found")),
        "Not Found"
      );
  }
}
