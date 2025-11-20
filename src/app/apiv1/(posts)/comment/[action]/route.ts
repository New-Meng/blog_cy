import { withApiHandler } from "@/app/lib/server/api-handler";
import { verifyToken, VerifyTokenInterface } from "@/app/lib/server/auth";
import prisma from "@/app/lib/server/db";
import { NextRequest, NextResponse } from "next/server";
import prasimaErrorTypeGuard from "@/app/lib/server/ErrorTypeGuard";
import { JWTPayload } from "jose";

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
      !body.visitorName ||
      (!body.visitorName.trim() && validateRes.data.username)
    ) {
      return reject("访客名称不能为空");
    }

    if (
      !body.visitorEmail ||
      (!body.visitorEmail.trim() && validateRes.data.username)
    ) {
      return reject("访客邮箱不能为空");
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.visitorEmail)) {
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

interface CreateCommentDto {
  content: string;
  postId: number;
  parentId?: number;
  visitorName: string;
  visitorEmail: string;
}

export const POST = async (
  request: NextRequest,
  { params }: { params: { action: string } }
): Promise<NextResponse> => {
  const { action } = await params;

  switch (action) {
    case "create": {
      const validateRes = await verifyToken(request);

      try {
        const body: CreateCommentDto = await request.json();
        try {
          await createValidateEntry(body, validateRes);
        } catch (error) {}
        // 创建评论
        const comment = await prisma.comment.create({
          data: {
            content: body.content.trim(),
            postId: body.postId,
            userId: validateRes ? validateRes.data.userId : undefined,
            parentId: body.parentId ? Number(body.parentId) : undefined,
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

    default:
      return withApiHandler(() => Promise.reject("Not Found"));
  }
};
