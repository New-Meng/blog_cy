import prisma from "@/app/lib/server/db";
import { withApiHandler } from "@/app/lib/server/api-handler";
import { verifyToken } from "@/app/lib/server/auth";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) => {
  const { action } = await params;

  switch (action) {
    case "list":
      // 测试用的，文章列表，无需验证权限
      // const validateRes = verifyToken(request);
      // if (!validateRes.success) {
      //   return withApiHandler(() => Promise.reject(validateRes.data), "", {
      //     code: validateRes.code,
      //   });
      // }
      return withApiHandler(() => Promise.resolve([]), "成功");

    default:
      return withApiHandler(() => Promise.reject(), "Not Font 404");
  }
};
