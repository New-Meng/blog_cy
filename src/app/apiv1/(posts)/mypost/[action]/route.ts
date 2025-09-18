import { withApiHandler } from "@/app/lib/server/api-handler";
import { verifyToken } from "@/app/lib/server/auth";
import prisma from "@/app/lib/server/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prasimaErrorTypeGuard from "@/app/lib/server/ErrorTypeGuard";

export const GET = async (
  request: Request,
  { params }: { params: { action: string } }
): Promise<NextResponse> => {
  const { action } = params;

  switch (action) {
    case "list":
      console.log(action);
      const url = new URL(request.url);
      const userId = Number(url.searchParams.get("userId"));
      if (userId && !isNaN(userId)) {
        const posts = await prisma.user.findUnique({
          where: {
            id: Number(userId), // 或 String(params.userId)（根据 ID 类型调整）
          },
          include: {
            posts: true, // 包含关联的 posts
          },
        });

        const responseData = posts ? posts : [];
        console.log(posts, "++??");
        return withApiHandler(() => Promise.resolve(responseData), "成功");
      }

    default:
      return withApiHandler(() => Promise.reject(), "Not Font 404");
  }
};

export const POST = async (
  request: Request,
  { params }: { params: { action: string } }
): Promise<NextResponse> => {
  const { action } = await params;

  switch (action) {
    case "createpost":
      const body = await request.json();
      const jwtValidate = verifyToken(request);
      if (jwtValidate.code !== 200) {
        return withApiHandler(() => Promise.reject(jwtValidate.data), "", {
          code: jwtValidate.code,
        });
      } else {
        let userId = jwtValidate.data.userId;
        console.log(body, userId, "++??body");
        try {
          await prisma.post.create({
            data: {
              title: body.acticleTitle,
              content: body.content,
              published: body.published,
              authorId: userId,
            },
          });

          return withApiHandler(() => Promise.resolve(null), "成功");
        } catch (error) {
          const errorType = prasimaErrorTypeGuard(error);

          if (errorType.code !== 0) {
            return withApiHandler(() => Promise.reject(errorType.message));
          } else {
            return withApiHandler(() => Promise.reject("未捕获的错误"));
          }
        }
      }

    default:
      return withApiHandler(() => Promise.reject("Not Found"));
  }
};
