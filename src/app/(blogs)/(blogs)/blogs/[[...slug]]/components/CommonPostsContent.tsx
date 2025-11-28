import { _$fetch } from "@/app/lib/client/fetch";
import React from "react";
import CommonPostTitle from "./ComonpostTitle/index";
import { marked } from "marked";
import PaginationWidget from "./PaginationWidget/PaginationWidget";
import { headers } from "next/headers";
import CustomEditor from "../../../components/CustomEditor";

type ListItemType = {
  title: string;
  createdAt: Date;
  id: number;
  content: string;
  updatedAt: Date;
  published: boolean;
  deletedAt: Date | null;
  authorId: number;
  likeCount: number;
  favoriteCount: number;
  previewContent?: string;
};

type ListResponseType = {
  list: ListItemType[];
  total: number;
  pageNo: number;
  pageSize: number;
};

const convertListToHtml = async (list: ListItemType[]) => {
  return Promise.all(
    list?.map((item) => {
      return marked.parse(item.content || "");
    }) || []
  );
};

const CommonPostsContent = async ({
  pageNo,
  title,
  tag,
}: {
  pageNo: string;
  title: string;
  tag: string;
}) => {
  let list: ListItemType[] = [];
  let total = 0;
  let current = 1;
  let pageSize = 10;
  let isSeverError = false;
  try {
    const res = await _$fetch.get<ListResponseType>(
      `/apiv1/blogs/list?pageNo=${pageNo}&title=${title}&tag=${tag}`
    );
    console.log(res.data, "++??list");
    list = res.data.list || [];
    total = res.data.total;
    current = res.data.pageNo;
    pageSize = res.data.pageSize;
    console.log(res, "++??res");
  } catch (error) {
    isSeverError = true;
  }

  return (
    <>
      <div className="article-list mobile:p-[10px] pc:p-[10px] w-full flex flex-col justify-center items-center gap-[10px]">
        {list?.map((item) => {
          return (
            <div
              key={item.id}
              className="article-item cursor-pointer w-full h-auto bg-[#fff] rounded-[10px] box-border p-[20px] overflow-hidden"
            >
              <div className="my-2">
                <CommonPostTitle
                  isClick={true}
                  baseInfo={{
                    title: item.title,
                    createdAt: item.createdAt,
                    postId: item.id,
                  }}
                ></CommonPostTitle>
              </div>

              <CustomEditor
                readonly={true}
                content={item.previewContent || ""}
              ></CustomEditor>
            </div>
          );
        })}
      </div>
      <PaginationWidget
        isSeverError={isSeverError}
        total={total}
        current={current}
        pageSize={pageSize}
      />
    </>
  );
};

export default CommonPostsContent;
