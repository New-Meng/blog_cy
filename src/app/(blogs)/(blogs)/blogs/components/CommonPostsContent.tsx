import { _$fetch } from "@/app/lib/client/fetch";
import React from "react";
import CommonPostTitle from "./CommonPostTitle";
import { marked } from "marked";
import PaginationWidget from "./PaginationWidget/PaginationWidget";
import { headers } from "next/headers";

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
}: {
  pageNo: string;
  title: string;
}) => {
  const res = await _$fetch.get<ListResponseType>(
    `apiv1/blogs/list?pageNo=${pageNo}&title=${title}`
  );
  const list = res.data.list || [];
  const total = res.data.total;
  const current = res.data.pageNo;
  const pageSize = res.data.pageSize;
  console.log(res, "++??res");
  // res.data.forEach((item) => {
  //   let firstRow = item.content.split("\n\n");
  //   item.firstRowHtml = firstRow[0] || "";
  // });

  const a = await convertListToHtml(res.data.list);

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
                  baseInfo={{ title: item.title, createdAt: item.createdAt }}
                ></CommonPostTitle>
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: item.firstRowHtml || "" }}
              ></div>
            </div>
          );
        })}
      </div>
      <PaginationWidget total={total} current={current} pageSize={pageSize} />
    </>
  );
};

export default CommonPostsContent;
