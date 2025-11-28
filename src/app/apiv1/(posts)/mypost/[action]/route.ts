import {
  validateRequestBody,
  withApiHandler,
} from "@/app/lib/server/api-handler";
import { verifyToken } from "@/app/lib/server/auth";
import prisma from "@/app/lib/server/db";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prasimaErrorTypeGuard from "@/app/lib/server/ErrorTypeGuard";
import { paginationListResponse } from "@/app/lib/server/responseModel";

export const GET = async (
  request: NextRequest,
  { params }: { params: { action: string } }
): Promise<NextResponse> => {
  const { action } = params;

  switch (action) {
    case "list": {
      const validateRes = await verifyToken(request);
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
            where: { authorId: Number(userId), deletedAt: null },
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
      const validateRes = await verifyToken(request);
      let userId: number | undefined = undefined;

      if (validateRes.code === 200) {
        userId = validateRes.data.userId;
      } else {
        if (validateRes.code == 401 || validateRes.code == 403) {
          // 验证失败，滚去登录
          return NextResponse.redirect(
            new URL(`/login?errorData=${validateRes.data}`, request.url)
          );
        } else {
          // 未知的验证异常
          return withApiHandler(() => Promise.reject(validateRes.data));
        }
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
      } else {
        return withApiHandler(() => Promise.reject("postsId参数异常"));
      }
    }

    default:
      return withApiHandler(() => Promise.reject(), "Not Font 404");
  }
};

type CreatePostReqBodyType = {
  acticleTitle: string;
  content: string;
  published: boolean;
  previewContent: string;
  tagIds?: string[];
};

export const POST = async (
  request: NextRequest,
  { params }: { params: { action: string } }
): Promise<NextResponse> => {
  const { action } = await params;

  switch (action) {
    case "createpost": {
      const bodyRes = await validateRequestBody(request);
      if (!bodyRes.success) {
        return withApiHandler(() => Promise.reject(), bodyRes.message);
      } else {
        const body: CreatePostReqBodyType = bodyRes.body;
        const jwtValidate = await verifyToken(request);
        if (jwtValidate.code !== 200) {
          return withApiHandler(() => Promise.reject(jwtValidate.data), "", {
            code: jwtValidate.code,
          });
        } else {
          let userId = jwtValidate.data.userId;
          console.log(body, userId, "++??body");
          try {
            const transactionRes = await prisma.$transaction(async (tx) => {
              try {
                // 创建文章 + 写入关联标签，一个错误，都回滚
                const resPustPost = await tx.post.create({
                  data: {
                    title: body.acticleTitle,
                    content: body.content,
                    published: body.published,
                    authorId: userId,
                    previewContent: body.previewContent,
                  },
                });
                if (resPustPost.id) {
                  if (body?.tagIds) {
                    const createPostTag = await tx.postTag.createMany({
                      data: body?.tagIds?.map((tagId) => {
                        return {
                          tagId: Number(tagId),
                          postId: resPustPost.id,
                        };
                      }),
                    });
                    if (createPostTag.count === body?.tagIds?.length) {
                      return {
                        success: true,
                        message: "创建文章成功",
                        code: 200,
                      };
                    } else {
                      throw new Error("标签关联错误");
                    }
                  } else {
                    return {
                      success: true,
                      message: "创建文章成功",
                      code: 200,
                    };
                  }
                } else {
                  return {
                    message: "创建文章失败",
                    code: 500,
                    success: false,
                  };
                }
              } catch (error) {
                return {
                  message: error || "未知的错误",
                  code: 500,
                  success: false,
                };
              }
            });

            if (transactionRes.success) {
              return withApiHandler(
                () => Promise.resolve(null),
                "创建文章成功"
              );
            } else {
              return withApiHandler(() =>
                Promise.reject(transactionRes.message || "创建文章失败")
              );
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
    }

    case "editpost": {
      const body = await request.json();
      const jwtValidate = await verifyToken(request);
      if (jwtValidate.code !== 200) {
        return withApiHandler(() => Promise.reject(jwtValidate.data), "", {
          code: jwtValidate.code,
        });
      } else {
        if (body.id && !isNaN(Number(body.id))) {
          try {
            await prisma.post.update({
              where: {
                id: Number(body.id),
              },
              data: {
                title: body.title,
                content: body.content,
                published: body.published,
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
        } else {
          return withApiHandler(() => Promise.reject("文章id传递错误"));
        }
      }
    }

    default:
      return withApiHandler(() => Promise.reject("Not Found"));
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { action: string } }
): Promise<NextResponse> => {
  const { action } = params;
  switch (action) {
    case "delete": {
      const jwtValidate = await verifyToken(request);
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
