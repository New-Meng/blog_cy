import React from "react";

import { _$fetch } from "@/app/lib/client/fetch";
import CommonTitleBar from "./components/CommonTitleBar";
import CommonClassifyWidget from "./components/CommonClassifyWidget";
import CommonPostsContent from "./components/CommonPostsContent";

const BlogsPage = async ({
  params,
  searchParams,
}: {
  searchParams: { pageNo?: string; title?: string; slug: string[] };
  params: { slug: string[] };
}) => {
  const tag = params?.slug?.length > 0 ? params.slug[0] : "";
  console.log(tag, "++??slug");
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

        <div className="w-full pc:mt-[20px] fade-in-left">
          <CommonPostsContent tag={tag} pageNo={pageNo} title={title} />
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
