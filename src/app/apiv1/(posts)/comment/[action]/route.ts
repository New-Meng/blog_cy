import {
  validateRequestBody,
  withApiHandler,
} from "@/app/lib/server/api-handler";
import { verifyToken, VerifyTokenInterface } from "@/app/lib/server/auth";
import prisma from "@/app/lib/server/db";
import { NextRequest, NextResponse } from "next/server";
import prasimaErrorTypeGuard from "@/app/lib/server/ErrorTypeGuard";

const createValidateEntry = (
  body: CreateCommentDto,
  validateRes: VerifyTokenInterface
) => {
  return new Promise(async (resolve, reject) => {
    // 参数验证和判空
    if (!body.content || !body.content.trim()) {
      return reject("评论内容不能为空");
    }

    if (!body.postId || isNaN(Number(body.postId))) {
      return reject("文章ID必须为有效数字");
    }

    if (
      !body.visitorName &&
      !body.visitorName.trim() &&
      !validateRes.data.username
    ) {
      return reject("访客名称不能为空");
    }

    if (
      !body.visitorEmail &&
      !body.visitorEmail.trim() &&
      !validateRes.data.email
    ) {
      return reject("访客邮箱不能为空");
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.visitorEmail || validateRes.data.email)) {
      return reject("邮箱格式不正确");
    }

    // 验证文章是否存在
    const postExists = await prisma.post.findUnique({
      where: {
        id: Number(body.postId),
        deletedAt: null,
      },
    });

    if (!postExists) {
      return reject("文章不存在或已被删除");
    }

    // 如果有父评论，验证父评论是否存在
    if (body.parentId) {
      const parentCommentExists = await prisma.comment.findUnique({
        where: {
          id: Number(body.parentId),
          deletedAt: null,
        },
      });

      if (!parentCommentExists) {
        return reject("父评论不存在或已被删除");
      }
    }

    return resolve(true);
  });
};

const listToDeepTree = (list: any[]) => {
  const postParentMap: Record<string | number, any> = {};
  list.forEach((item) => {
    if (!item.rootId) {
      postParentMap[item.id] = item;
    }
  });

  list.forEach((item) => {
    if (item.rootId) {
      const parent = postParentMap[item.rootId];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
  });
  const res = Object.keys(postParentMap).map((key) => {
    return postParentMap[key];
  });
  return res;
};

interface CreateCommentDto {
  content: string;
  postId: number;
  parentId?: number;
  rootId?: number;
  visitorName: string;
  visitorEmail: string;

  applyUserId?: number;
  tempApplyUserName?: string;
}

interface LikeCommentDto {
  postId: number;
  commentId: number;
  like?: boolean;
  unlike?: boolean;
}

interface UnlikeCommentDto {
  postId: number;
  commentId: number;
}

export const POST = async (
  request: NextRequest,
  { params }: { params: { action: string } }
): Promise<NextResponse> => {
  const { action } = await params;

  const validateRes = await verifyToken(request);

  switch (action) {
    case "create": {
      try {
        const validateBody = await validateRequestBody(request);
        if (!validateBody.success) {
          return withApiHandler(() => Promise.reject(validateBody.message));
        }
        const body: CreateCommentDto = validateBody.body;
        try {
          const validateResult = await createValidateEntry(body, validateRes);
        } catch (error) {
          return withApiHandler(() => Promise.reject(error));
        }
        // 创建评论
        const comment = await prisma.comment.create({
          data: {
            content: body.content.trim(),
            postId: body.postId,
            userId: validateRes ? validateRes.data.userId : undefined,
            parentId: body.parentId ? Number(body.parentId) : undefined,
            rootId: body.rootId ? Number(body.rootId) : undefined,
            visitorName: body.visitorName.trim(),
            visitorEmail: body.visitorEmail.trim(),
            applyUserId: body.applyUserId
              ? Number(body.applyUserId)
              : undefined,
            tempApplyUserName: body.tempApplyUserName?.trim(),
            ipAddress:
              request.headers.get("x-forwarded-for") ||
              request.headers.get("x-real-ip") ||
              "unknown",
            userAgent: request.headers.get("user-agent") || "unknown",
          },
        });

        return withApiHandler(
          () =>
            Promise.resolve({
              id: comment.id,
              content: comment.content,
              createdAt: comment.createdAt,
              visitorName: comment.visitorName,
            }),
          "评论创建成功"
        );
      } catch (error) {
        const errorType = prasimaErrorTypeGuard(error);

        if (errorType.code !== 0) {
          return withApiHandler(() => Promise.reject(errorType.message));
        } else {
          console.error("创建评论错误:", error);
          return withApiHandler(() => Promise.reject("创建评论时发生错误"));
        }
      }
    }

    case "delete": {
      const validateRes = await verifyToken(request);
      if (validateRes.code == 200) {
        const validateBody = await validateRequestBody(request);
        if (!validateBody.success) {
          return withApiHandler(() => Promise.reject(validateBody.message));
        }

        const postId = Number(validateBody.body?.postId);
        const commentId = Number(validateBody.body?.commentId);
        if (!postId || isNaN(postId) || !commentId || isNaN(commentId)) {
          return withApiHandler(() =>
            Promise.reject("文章ID或评论ID不能为空或无效")
          );
        }

        try {
          const res = await prisma.comment.updateMany({
            where: {
              id: commentId,
              postId,
              deletedAt: null,
            },
            data: {
              deletedAt: new Date(),
            },
          });

          if (res.count === 0) {
            return withApiHandler(() => Promise.reject("评论不存在或已删除"));
          }
          return withApiHandler(() => Promise.resolve(null), "删除成功");
        } catch (error) {
          const errorType = prasimaErrorTypeGuard(error);
          if (errorType.code !== 0) {
            return withApiHandler(() => Promise.reject(errorType.message));
          } else {
            return withApiHandler(() => Promise.reject("删除评论时发生错误"));
          }
        }
      } else {
        return withApiHandler(() => Promise.reject(validateRes.data), "", {
          code: validateRes.code,
        });
      }
    }

    case "like": {
      // 点赞和取消点赞，必须登录
      if (!validateRes.success) {
        return withApiHandler(() => Promise.reject(validateRes.data), "", {
          code: validateRes.code,
        });
      } else {
        const validateBody = await validateRequestBody(request);
        if (!validateBody.success) {
          return withApiHandler(() => Promise.reject(validateBody.message));
        }
        const body: LikeCommentDto = validateBody.body;
        const trasctjionResult = await prisma.$transaction(async (tx) => {
          try {
            const findData = await tx.commentLike.findFirst({
              where: {
                userId: validateRes.data.userId,
                commentId: body.commentId,
              },
            });
            if (findData?.like) {
              return {
                message: "您已点赞过该评论",
                code: 500,
              };
            } else if (findData?.unlike) {
              return {
                message: "赞和踩不能同时操作",
                code: 500,
              };
            }
            const res9 = await tx.comment.updateMany({
              where: {
                id: body.commentId,
                postId: body.postId,
                deletedAt: null,
              },
              data: {
                like: {
                  increment: 1,
                },
              },
            });
            console.log(res9, "++??res9");
            if (findData?.id) {
              await tx.commentLike.updateMany({
                where: {
                  id: findData.id,
                },
                data: {
                  like: true,
                },
              });
            } else {
              await tx.commentLike.create({
                data: {
                  userId: validateRes.data.userId,
                  commentId: body.commentId,
                  like: true,
                  unlike: false,
                },
              });
            }

            return {
              code: 200,
              message: "点赞成功",
            };
          } catch (error) {
            return {
              message: "未知事务错误",
              code: 500,
            };
          }
        });

        if (trasctjionResult.code == 200) {
          return withApiHandler(() => Promise.resolve(null), "点赞成功");
        } else {
          return withApiHandler(
            () => Promise.reject(trasctjionResult.message),
            "",
            {
              code: trasctjionResult.code,
            }
          );
        }
      }
    }

    case "cancelLike": {
      if (!validateRes.success) {
        return withApiHandler(() => Promise.reject(validateRes.data), "", {
          code: validateRes.code,
        });
      } else {
        try {
          const validateBody = await validateRequestBody(request);
          if (!validateBody.success) {
            return withApiHandler(() => Promise.reject(validateBody.message));
          }
          const body: LikeCommentDto = validateBody.body;
          const trasctjionResult = await prisma.$transaction(async (tx) => {
            try {
              const findData = await tx.commentLike.findFirst({
                where: {
                  userId: validateRes.data.userId,
                  commentId: body.commentId,
                },
              });
              if (!findData || !findData.like) {
                return {
                  message: "您尚未点赞该评论",
                  code: 500,
                };
              }
              await tx.comment.updateMany({
                where: {
                  id: body.commentId,
                  postId: body.postId,
                  deletedAt: null,
                },
                data: {
                  like: {
                    decrement: 1,
                  },
                },
              });
              await tx.commentLike.updateMany({
                where: {
                  id: findData.id,
                },
                data: {
                  like: false,
                },
              });
              return {
                code: 200,
                message: "取消点赞成功",
              };
            } catch (error) {
              return {
                message: "未知事务错误",
                code: 500,
              };
            }
          });

          if (trasctjionResult.code == 200) {
            return withApiHandler(() => Promise.resolve(null), "取消点赞成功");
          }
        } catch (error) {}
      }
    }

    case "unlike": {
      // 点踩
      if (!validateRes.success) {
        return withApiHandler(() => Promise.reject(validateRes.data), "", {
          code: validateRes.code,
        });
      } else {
        const validateBody = await validateRequestBody(request);
        if (!validateBody.success) {
          return withApiHandler(() => Promise.reject(validateBody.message));
        }
        const body: UnlikeCommentDto = validateBody.body;
        const trasctjionResult = await prisma.$transaction(async (tx) => {
          try {
            const findData = await tx.commentLike.findFirst({
              where: {
                userId: validateRes.data.userId,
                commentId: body.commentId,
              },
            });
            if (findData?.unlike) {
              return {
                message: "不能重复操作点踩",
                code: 500,
              };
            } else if (findData?.like) {
              return {
                message: "赞和踩不能同时操作",
                code: 500,
              };
            }
            const dbRes = await tx.comment.updateMany({
              where: {
                id: body.commentId,
                postId: body.postId,
                deletedAt: null,
              },
              data: {
                unlike: {
                  decrement: 1,
                },
              },
            });
            if (findData?.id) {
              await tx.commentLike.updateMany({
                where: {
                  id: findData.id,
                },
                data: {
                  unlike: true,
                },
              });
            } else {
              await tx.commentLike.create({
                data: {
                  userId: validateRes.data.userId,
                  commentId: body.commentId,
                  like: false,
                  unlike: true,
                },
              });
            }

            return {
              code: 200,
              message: "点踩成功",
            };
          } catch (error) {
            return {
              message: "未知事务错误",
              code: 500,
            };
          }
        });

        if (trasctjionResult.code == 200) {
          return withApiHandler(() => Promise.resolve(null), "点踩成功");
        } else {
          return withApiHandler(
            () => Promise.reject(trasctjionResult.message),
            "",
            {
              code: trasctjionResult.code,
            }
          );
        }
      }
    }

    case "cancelUnlike": {
      if (!validateRes.success) {
        return withApiHandler(() => Promise.reject(validateRes.data), "", {
          code: validateRes.code,
        });
      } else {
        try {
          const validateBody = await validateRequestBody(request);
          if (!validateBody.success) {
            return withApiHandler(() => Promise.reject(validateBody.message));
          }
          const body: UnlikeCommentDto = validateBody.body;
          const trasctjionResult = await prisma.$transaction(async (tx) => {
            try {
              const findData = await tx.commentLike.findFirst({
                where: {
                  userId: validateRes.data.userId,
                  commentId: body.commentId,
                },
              });
              if (!findData || !findData.unlike) {
                return {
                  message: "您尚未点踩该评论",
                  code: 500,
                };
              }
              await tx.comment.updateMany({
                where: {
                  id: body.commentId,
                  postId: body.postId,
                  deletedAt: null,
                },
                data: {
                  like: {
                    increment: 1,
                  },
                },
              });
              await tx.commentLike.updateMany({
                where: {
                  id: findData.id,
                },
                data: {
                  unlike: false,
                },
              });
              return {
                code: 200,
                message: "取消点踩成功",
              };
            } catch (error) {
              return {
                message: "未知事务错误",
                code: 500,
              };
            }
          });

          if (trasctjionResult.code == 200) {
            return withApiHandler(() => Promise.resolve(null), "取消点踩成功");
          }
        } catch (error) {}
      }
    }

    default:
      return withApiHandler(() => Promise.reject("Not Found"));
  }
};

export const GET = async (
  request: NextRequest,
  { params }: { params: { action: string } }
): Promise<NextResponse> => {
  const { action } = await params;

  switch (action) {
    case "get": {
      const validateRes = await verifyToken(request);
      let userId: number | undefined = undefined;

      if (validateRes.code === 200) {
        userId = validateRes.data.userId;
      }
      const url = new URL(request.url);
      let postId = Number(url.searchParams.get("postId"));

      if (!postId || isNaN(postId)) {
        return withApiHandler(() => Promise.reject("文章ID不能为空或无效"));
      } else {
        const dbRes = await prisma.comment.findMany({
          where: {
            postId: postId,
            deletedAt: null,
          },
          // 指定返回字段，和 join user 返回字段
          select: {
            id: true,
            rootId: true,
            parentId: true,
            content: true,
            createdAt: true,
            visitorName: true,
            visitorEmail: true,
            tempApplyUserName: true, // 匿名用户评论
            applyUserId: true,
            applyUser: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },

            user: {
              select: {
                id: true,
                username: true,
                avatar: true, // 只选择需要的字段
                // 不包含 email 等敏感信息
              },
            },
            commentLikes: userId
              ? {
                  where: {
                    userId: userId,
                  },
                  select: {
                    like: true,
                    unlike: true,
                    id: true,
                  },
                }
              : undefined,
          },
          orderBy: {
            createdAt: "asc", // 按创建时间排序，确保子评论在父评论之后
          },
        });

        const commentsWithLikeStatus = dbRes.map((comment) => {
          const { commentLikes, ...rest } = comment;
          let isUnLike = false;
          let isLike = false;
          if (commentLikes && commentLikes.length > 0) {
            isUnLike = commentLikes[0].unlike;
            isLike = commentLikes[0].like;
          }
          return {
            ...rest,
            isUnLike,
            isLike,
          };
        });

        const resultList = listToDeepTree(commentsWithLikeStatus);
        console.log(resultList, "++??kk");
        return withApiHandler(() => Promise.resolve(resultList || []), "成功");
      }
    }

    default:
      return withApiHandler(() => Promise.reject("Not Found"));
  }
};
