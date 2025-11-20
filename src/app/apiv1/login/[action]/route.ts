import { LoginDefaultDto } from "@/types/UserTypes";
import prisma from "@/app/lib/server/db";
import { withApiHandler } from "@/app/lib/server/api-handler";
import { compare, hash } from "bcryptjs";
const { SignJWT } = require("jose");
import prasimaErrorTypeGuard from "@/app/lib/server/ErrorTypeGuard";

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) => {
  const { action } = await params;

  switch (action) {
    case "default":
      const body: LoginDefaultDto = await request.json();
      if (!body.userNameOrMobile) {
        return withApiHandler(() => Promise.reject("用户邮箱或手机号必须填写"));
      }
      if (!body.password) {
        return withApiHandler(() => Promise.reject("用户密码必须填写"));
      }

      let dbRes = null;
      try {
        if (body.userNameOrMobile.includes("@")) {
          dbRes = await prisma.user.findUnique({
            where: {
              email: body.userNameOrMobile,
            },
          });
        } else {
          dbRes = await prisma.user.findUnique({
            where: {
              mobile: body.userNameOrMobile,
            },
          });
        }
      } catch (error) {
        const errorRes = prasimaErrorTypeGuard(error);
        if (errorRes.code !== 0) {
          return withApiHandler(() => Promise.reject(errorRes.message));
        } else {
          return withApiHandler(() => Promise.reject(error));
        }
      }

      if (dbRes?.password) {
        const { password, hashpassword, ...userInfo } = dbRes;
        // 原始密码 对比 hash值
        let isValida = await compare(body.password, hashpassword);
        if (isValida) {
          // 2. 生成 JWT
          const secretBuffer = Buffer.from(process.env.JWT_SECRET!);
          const token = await new SignJWT({
            userId: dbRes.id,
            email: dbRes.email,
            username: dbRes.username,
          })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt(Date.now())
            .setExpirationTime("1d")
            .sign(secretBuffer);

          const response = await withApiHandler(
            () =>
              Promise.resolve({
                token: token,
                userInfo: userInfo,
              }),
            "登录成功!"
          );
          // 设置cookie 暂时不用cookie
          response.headers.set(
            "Set-Cookie",
            `Authorization=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${
              60 * 60 * 24
            }` // 1天有效期
          );

          return response;
        } else {
          return withApiHandler(() =>
            Promise.reject(new Error("账号密码错误，请重新登录!"))
          );
        }
      } else {
        return withApiHandler(() =>
          Promise.reject(new Error("账号密码错误，请重新登录!"))
        );
      }

    default:
      return withApiHandler(() => Promise.reject(new Error("Not Found")));
  }
};
