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
      const url = new URL(request.url);
      let postId = Number(url.searchParams.get("postId"));

      if (!postId || isNaN(postId)) {
        return withApiHandler(() => Promise.reject("文章ID不能为空或无效"));
      } else {
        const dbRes = await prisma.comment.findMany({
          where: {
            postId: postId,
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

            user: {
              select: {
                id: true,
                username: true,
                avatar: true, // 只选择需要的字段
                // 不包含 email 等敏感信息
              },
            },
          },
          orderBy: {
            createdAt: "asc", // 按创建时间排序，确保子评论在父评论之后
          },
        });

        const resultList = listToDeepTree(dbRes);
        console.log(resultList, "++??kk");
        return withApiHandler(() => Promise.resolve(resultList || []));
      }
    }

    default:
      return withApiHandler(() => Promise.reject("Not Found"));
  }
};
