import prisma from "@/app/lib/server/db";
import {
  validateRequestBody,
  withApiHandler,
} from "@/app/lib/server/api-handler";
import { NextRequest } from "next/server";
import { verifyToken } from "@/app/lib/server/auth";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) => {
  const { action } = await params;

  switch (action) {
    case "list":
      const url = new URL(request.url);
      const pageNo = Number(url.searchParams.get("pageNo") || 1);
      const title = url.searchParams.get("title") || "";
      const tag = url.searchParams.get("type") || "";
      let pageSize = Number(url.searchParams.get("pageSize")) || 10;
      if (pageSize > 10) {
        pageSize = 10;
      }
      console.log(pageNo, pageSize, "++??pagination");

      const PasimaWhereObj = title
        ? {
            title: {
              contains: title, // 类似 SQL 的 LIKE '%关键词%'
              // mode: "insensitive", // 不区分大小写 报错 可能不存在这个方法
            },
          }
        : {};

      const res = await prisma.post.findMany({
        take: pageSize,
        skip: (pageNo - 1) * pageSize,
        where: { ...PasimaWhereObj },
        orderBy: {
          createdAt: "desc", // 按创建时间降序排列（最新在前）
        },
      });
      const totalPosts = await prisma.post.count({
        where: {
          ...PasimaWhereObj,
        },
      });
      const returnRes = {
        list: res,
        total: totalPosts,
        pageSize: pageSize,
        pageNo: pageNo,
      };

      return withApiHandler(() => Promise.resolve(returnRes), "成功");

    default:
      return withApiHandler(() => Promise.reject(), "Not Font 404");
  }
};

type CommonTypeDto = {
  postId: number;
};
export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) => {
  const { action } = await params;
  const bodyRes = await validateRequestBody(request);
  let postId;
  if (!bodyRes.success) {
    return withApiHandler(() => Promise.resolve(), bodyRes.message);
  } else {
    postId = bodyRes.body.postId;
  }
  switch (action) {
    case "favorite": {
      const jwtValidate = await verifyToken(request);

      if (jwtValidate.code !== 200) {
        return withApiHandler(() => Promise.reject(jwtValidate.data), "", {
          code: jwtValidate.code,
        });
      }

      let userId = jwtValidate.data.userId;

      const transactionRes = await prisma.$transaction(async (tx) => {
        const favoriteFindRes = await tx.favorite.findFirst({
          where: {
            userId: userId,
            postId: postId,
          },
        });

        if (favoriteFindRes && favoriteFindRes.favorited) {
          return {
            success: false,
            message: "不可重复收藏",
          };
        } else if (favoriteFindRes && !favoriteFindRes?.favorited) {
          try {
            await tx.favorite.update({
              where: {
                id: favoriteFindRes.id,
              },
              data: {
                userId: userId,
                postId: postId,
                favorited: true,
              },
            });

            await tx.post.update({
              where: {
                id: postId,
              },
              data: {
                favoriteCount: {
                  increment: 1,
                },
              },
            });
            return {
              success: true,
              message: "收藏成功",
            };
          } catch (error) {
            return {
              success: false,
              message: "收藏失败，数据更新失败",
            };
          }
        } else {
          try {
            await tx.favorite.create({
              data: {
                userId: userId,
                postId: postId,
                favorited: true,
              },
            });
            await tx.post.update({
              where: {
                id: postId,
              },
              data: {
                favoriteCount: {
                  increment: 1,
                },
              },
            });
            return {
              success: true,
              message: "收藏成功",
            };
          } catch (error) {
            return {
              success: false,
              message: "收藏失败，数据新增失败",
            };
          }
        }
      });

      if (transactionRes.success) {
        return withApiHandler(() => Promise.resolve(), transactionRes.message);
      } else {
        return withApiHandler(() => Promise.reject(), transactionRes.message);
      }
    }

    case "unfavorite": {
      const jwtValidate = await verifyToken(request);

      if (jwtValidate.code !== 200) {
        return withApiHandler(() => Promise.reject(jwtValidate.data), "", {
          code: jwtValidate.code,
        });
      }

      let userId = jwtValidate.data.userId;

      const transactionRes = await prisma.$transaction(async (tx) => {
        const favoriteFindRes = await tx.favorite.findFirst({
          where: {
            userId: userId,
            postId: postId,
          },
        });

        if (favoriteFindRes && !favoriteFindRes.favorited) {
          return {
            success: false,
            message: "当前文章未搜藏",
          };
        } else if (favoriteFindRes && favoriteFindRes?.favorited) {
          try {
            await tx.favorite.update({
              where: {
                id: favoriteFindRes.id,
              },
              data: {
                userId: userId,
                postId: postId,
                favorited: false,
              },
            });
            await tx.post.update({
              where: {
                id: postId,
              },
              data: {
                favoriteCount: {
                  decrement: 1,
                },
              },
            });
            return {
              success: true,
              message: "取消收藏成功",
            };
          } catch (error) {
            return {
              success: false,
              message: "取消收藏失败，数据更新失败",
            };
          }
        } else {
          return {
            success: false,
            message: "未知的错误",
          };
        }
      });

      if (transactionRes.success) {
        return withApiHandler(() => Promise.resolve(), transactionRes.message);
      } else {
        return withApiHandler(() => Promise.reject(transactionRes.message));
      }
    }
  }
};
