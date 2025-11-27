// 服务端组件，建议直接查询数据库，不要调用接口
import { _$fetch } from "@/app/lib/client/fetch";
import { withApiHandler } from "@/app/lib/server/api-handler";
import prisma from "@/app/lib/server/db";
import prasimaErrorTypeGuard from "@/app/lib/server/ErrorTypeGuard";
import CustomEditor from "../../components/CustomEditor";

import CommonTitleBar from "../../blogs/[[...slug]]/components/CommonTitleBar";
import CommonClassifyWidget from "../../blogs/[[...slug]]/components/CommonClassifyWidget";
import CustomComment from "@/components/client/CustomComment";
import CommentListWidget from "@/components/client/CommentListWidget";
import { CommentProvider } from "./CommentProvider";
import PostOperate from "./components/PostOperate";
import { verifyToken } from "@/app/lib/server/auth";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

type DetailType = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  likeCount: number;
  favoriteCount: number;
};

type searchEnterParams = {
  searchParams: { postId: number };
};

type PostWithFavorites = Prisma.PostGetPayload<{
  include: {
    favorites: {
      select: {
        id: true;
      };
    };
  };
}>;
export type CustomPost = Omit<PostWithFavorites, "favorites"> & {
  isFavorited: boolean;
};

const getPostDetailInfo = async (
  postId: number,
  userId: number | undefined
) => {
  if (postId && !isNaN(postId)) {
    try {
      const dbRes = await prisma.post.findUnique({
        where: {
          id: postId,
          deletedAt: null,
        },
        include: {
          favorites: {
            where: {
              postId,
              userId,
              favorited: true,
            },
            select: {
              id: true,
            },
          },
        },
      });

      return dbRes;
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
};

const postView = async ({ searchParams, ...args }: searchEnterParams) => {
  let userId;
  const cookie = (await cookies()).get("Authorization")?.value;
  if (typeof cookie === "string") {
    const jwtValidate = await verifyToken(cookie);
    if (jwtValidate.success) {
      userId = jwtValidate.data.userId;
    }
  }
  const postId = Number(searchParams.postId);
  const tempDetail = await getPostDetailInfo(postId, userId);
  const { favorites, ...otherParams } = tempDetail || {};

  const transformData: CustomPost = {
    ...(otherParams as Omit<CustomPost, "isFavorited">),
    isFavorited: (tempDetail?.favorites?.length || 0) > 0,
  };
  const detail = transformData || {};
  console.log(detail, "++??postdetail");

  return (
    <div className="w-full h-[100vh] box-border overflow-y-scroll">
      <div className="w-full px-3 mt-6">
        <CommonTitleBar></CommonTitleBar>
      </div>
      <div className="relative w-full h-auto pc:p-[20px] flex justify-start items-start mobile:flex-col">
        {/* 纯pc */}
        <div className="mobile:hidden w-[160px] box-border py-[20px] pr-[60px]">
          <CommonClassifyWidget></CommonClassifyWidget>
        </div>

        <div className="pc:hidden w-full">
          <CommonClassifyWidget></CommonClassifyWidget>
        </div>

        <div className="w-full pc:mt-[20px]">
          <div className="w-[full] h-full margin-[0__auto]">
            <div className="pt-2 px-2">
              <div className="px-2 py-3 rounded-sm text-[18px] font-bold bg-white">
                {detail?.title}
              </div>

              {detail?.content ? (
                <div className="mt-2 px-2 py-3 rounded-sm bg-white overflow-hidden">
                  <CustomEditor
                    readonly={true}
                    content={detail?.content}
                    options={{ minHeight: "500px" }}
                  ></CustomEditor>
                  <PostOperate postId={postId} item={detail}></PostOperate>
                </div>
              ) : (
                <div className="mt-2 px-2 py-3 rounded-sm bg-white">
                  暂无内容
                </div>
              )}
            </div>

            {/* 评论列表和发表组件 */}
            <CommentProvider>
              <CommentListWidget postId={postId}></CommentListWidget>

              <CustomComment postId={postId}></CustomComment>
            </CommentProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default postView;
