// 服务端组件，建议直接查询数据库，不要调用接口
import { _$fetch } from "@/app/lib/client/fetch";
import { withApiHandler } from "@/app/lib/server/api-handler";
import prisma from "@/app/lib/server/db";
import prasimaErrorTypeGuard from "@/app/lib/server/ErrorTypeGuard";
import CustomEditor from "../../components/CustomEditor";

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
  searchParams: { postId?: number };
};

const getPostDetailInfo = async (postId: number | null) => {
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
  const postId = Number(searchParams.postId) || null;
  const detail = await getPostDetailInfo(postId);
  console.log(detail, "++??resdetail");

  return (
    <div className="w-full h-full">
      <div className="w-[full] pc:w-[1200] h-full margin-[0__auto]">
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
      </div>
    </div>
  );
};

export default postView;
