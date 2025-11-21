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

const getPostDetailInfo = async (postId: number) => {
  if (postId && !isNaN(postId)) {
    try {
      const dbRes = await prisma.post.findUnique({
        where: {
          id: postId,
          deletedAt: null,
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

const postView = async ({ searchParams }: searchEnterParams) => {
  const postId = Number(searchParams.postId);
  const detail = await getPostDetailInfo(postId);
  console.log(detail, "++??resdetail");

  return (
    <div className="w-full h-[100vh] box-border overflow-y-scroll">
      <div className="w-full px-3 mt-6 fade-in-left">
        <CommonTitleBar></CommonTitleBar>
      </div>
      <div className="relative w-full h-auto pc:p-[20px] flex justify-start items-start mobile:flex-col">
        {/* 纯pc */}
        <div className="mobile:hidden w-[160px] box-border py-[20px] pr-[60px] fade-in-left">
          <CommonClassifyWidget></CommonClassifyWidget>
        </div>

        <div className="pc:hidden w-full fade-in-left">
          <CommonClassifyWidget></CommonClassifyWidget>
        </div>

        <div className="w-full pc:mt-[20px] fade-in-left">
          <div className="w-[full] h-full margin-[0__auto]">
            <div className="p-2">
              <div className="px-2 py-3 rounded-sm text-[18px] font-bold bg-white">
                {detail?.title}
              </div>

              {detail?.content && (
                <div className="mt-2 px-2 py-3 rounded-sm bg-white">
                  <CustomEditor
                    readonly={true}
                    content={detail?.content}
                    options={{ minHeight: "500px" }}
                  ></CustomEditor>
                </div>
              )}
            </div>

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
