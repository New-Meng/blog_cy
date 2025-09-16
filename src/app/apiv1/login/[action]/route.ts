import { LoginDefaultDto } from "@/types/UserTypes";
import prisma from "@/app/lib/server/db";
import { withApiHandler } from "@/app/lib/server/api-handler";

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
      if (body.userNameOrMobile.includes("@")) {
        try {
          const dbRes = await prisma.user.findUnique({
            where: {
              email: body.userNameOrMobile,
            },
          });

          if (dbRes) {
            return withApiHandler(() => Promise.resolve()), "登录成功!";
          } else {
            return withApiHandler(() =>
              Promise.reject(new Error("账号密码错误，请重新登录!"))
            );
          }
        } catch (error) {
          return withApiHandler(() => Promise.reject(error));
        }
      } else {
        try {
          const dbRes = await prisma.user.findUnique({
            where: {
              mobile: body.userNameOrMobile,
            },
          });
          if (dbRes) {
            return withApiHandler(() => {
              return Promise.resolve(null);
            }, "登录成功!");
          } else {
            return withApiHandler(() =>
              Promise.reject(new Error("账号密码错误，请重新登录!"))
            );
          }
        } catch (error) {
          return withApiHandler(() => Promise.reject(error));
        }
      }

    default:
      return withApiHandler(() => Promise.reject(new Error("Not Found")));
  }
};
