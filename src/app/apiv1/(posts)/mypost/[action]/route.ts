import { withApiHandler } from "@/app/lib/server/api-handler";
import { verifyToken } from "@/app/lib/server/auth";
import prisma from "@/app/lib/server/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prasimaErrorTypeGuard from "@/app/lib/server/ErrorTypeGuard";
import { paginationListResponse } from "@/app/lib/server/responseModel";

export const GET = async (
  request: Request,
  { params }: { params: { action: string } }
): Promise<NextResponse> => {
  const { action } = params;

  switch (action) {
    case "list": {
      const validateRes = verifyToken(request);
      let userId: number | undefined = undefined;

      if (validateRes.code === 200) {
        userId = validateRes.data.userId;
      } else {
        return withApiHandler(() => Promise.reject(validateRes.data));
      }
      if (userId) {
        const url = new URL(request.url);
        const pageSize = Number(url.searchParams.get("pageSize")) || 10;
        const pageNum = Number(url.searchParams.get("pageNum")) || 1;
        let posts = null;
        let totalPosts = 0;
        try {
          totalPosts = await prisma.post.count({
            where: { authorId: Number(userId) },
          });
          posts = await prisma.user.findUnique({
            where: {
              id: Number(userId), // 或 String(params.userId)（根据 ID 类型调整）
            },
            select: {
              posts: {
                where: {
                  deletedAt: null, // 只查询未删除的 posts
                },
                skip: (pageNum - 1) * pageSize, // 跳过前 0 条（第一页）
                take: pageSize, // 每页返回 10 条
                orderBy: { createdAt: "desc" }, // 按创建时间倒序
              }, // 仅仅查询关联的 posts
            },
          });
        } catch (error) {
          const errorRes = prasimaErrorTypeGuard(error);
          if (errorRes.code != 0) {
            return withApiHandler(() => Promise.reject(errorRes.message));
          } else {
            return withApiHandler(() => Promise.reject(error));
          }
        }

        const responseData = paginationListResponse(
          pageSize,
          pageNum,
          totalPosts,
          posts?.posts || []
        );
        return withApiHandler(() => Promise.resolve(responseData), "成功");
      }
    }

    case "detail": {
      const validateRes = verifyToken(request);
      let userId: number | undefined = undefined;

      if (validateRes.code === 200) {
        userId = validateRes.data.userId;
      } else {
        return withApiHandler(() => Promise.reject(validateRes.data));
      }
      const url = new URL(request.url);
      const postsId = Number(url.searchParams.get("postsId"));
      if (postsId && !isNaN(postsId)) {
        try {
          const dbRes = await prisma.post.findUnique({
            where: {
              id: postsId,
              deletedAt: null,
            },
          });
          if (!dbRes) {
            return withApiHandler(() => Promise.reject("未查询到对应文章"));
          } else if (dbRes?.authorId === userId) {
            return withApiHandler(() => Promise.resolve(dbRes), "成功");
          } else {
            return withApiHandler(
              () => Promise.reject(null),
              "无权访问其他用户文章详情"
            );
          }
        } catch (error) {
          let errorRes = prasimaErrorTypeGuard(error);
          if (errorRes.code != 0) {
            return withApiHandler(() => Promise.reject(errorRes.message));
          } else {
            return withApiHandler(() => Promise.reject(error));
          }
        }
      }
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
    case "createpost": {
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
    }

    default:
      return withApiHandler(() => Promise.reject("Not Found"));
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { action: string } }
): Promise<NextResponse> => {
  const { action } = params;
  switch (action) {
    case "delete": {
      const jwtValidate = verifyToken(request);
      if (jwtValidate.code !== 200) {
        return withApiHandler(() => Promise.reject(jwtValidate.data), "", {
          code: jwtValidate.code,
        });
      } else {
        const url = new URL(request.url);
        const postId = url.searchParams.get("postId");
        try {
          if (!postId) {
            return withApiHandler(() => Promise.reject("文章id必须传入"));
          } else {
            await prisma.post.update({
              where: {
                id: Number(postId),
                deletedAt: null,
              },
              data: {
                deletedAt: new Date(),
              },
            });

            return withApiHandler(() => Promise.resolve(null), "成功");
          }
        } catch (error) {
          const errorType = prasimaErrorTypeGuard(error);

          if (errorType.code !== 0) {
            return withApiHandler(() => Promise.reject(errorType.message));
          } else {
            return withApiHandler(() => Promise.reject("未捕获的错误"));
          }
        }
      }
    }

    default:
      return withApiHandler(() => Promise.reject("Not Found"));
  }
};
