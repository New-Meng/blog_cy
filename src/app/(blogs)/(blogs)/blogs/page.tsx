import React from "react";

import { _$fetch } from "@/app/lib/client/fetch";
import CommonTitleBar from "./components/CommonTitleBar";
import CommonClassifyWidget from "./components/CommonClassifyWidget";
import CommonPostsContent from "./components/CommonPostsContent";

const EmptyArticle = () => {
  return (
    <div className=" w-full min-h-[calc(100vh__-__200px)] flex items-center justify-center border-[1px]">
      数据为空
    </div>
  );
};

const BlogsPage = ({
  searchParams,
}: {
  searchParams: { pageNo?: string; title?: string };
}) => {
  const pageNo = searchParams.pageNo || "1";
  const title = searchParams.title || "";
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
          <CommonPostsContent pageNo={pageNo} title={title} />
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
