import { _$fetch } from "@/app/lib/client/fetch";
import React from "react";
import CommonPostTitle from "./CommonPostTitle";
import { marked } from "marked";

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
  firstRowHtml?: string;
};

const convertListToHtml = async (list: ListItemType[]) => {
  return Promise.all(
    list?.map((item) => {
      return marked.parse(item.content || "");
    }) || []
  );
};

const CommonPostsContent: React.FC = async () => {
  const res = await _$fetch.get<ListItemType[]>("apiv1/blogs/list");
  // res.data.forEach((item) => {
  //   let firstRow = item.content.split("\n\n");
  //   item.firstRowHtml = firstRow[0] || "";
  // });

  const a = await convertListToHtml(res.data);

  return (
    <div className="article-list mobile:p-[10px] pc:p-[10px] w-full flex flex-col justify-center items-center gap-[10px]">
      {res?.data?.map((item) => {
        return (
          <>
            <div className="article-item cursor-pointer w-full h-auto bg-[#fff] rounded-[10px] box-border p-[20px] overflow-hidden">
              <div className="my-2">
                <CommonPostTitle
                  isClick={true}
                  baseInfo={{ title: item.title, createdAt: item.createdAt }}
                ></CommonPostTitle>
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: item.firstRowHtml || "" }}
              ></div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default CommonPostsContent;
