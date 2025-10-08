"use client";
import React, { useEffect, useState } from "react";

import { _$fetch } from "@/app/lib/client/fetch";
import CommonTitleBar from "./components/CommonTitleBar";
import CommonClassifyWidget from "./components/CommonClassifyWidget";

const EmptyArticle = () => {
  return (
    <div className=" w-full min-h-[calc(100vh__-__200px)] flex items-center justify-center border-[1px]">
      数据为空
    </div>
  );
};

const BlogsPage = () => {
  return (
    <div className="w-full h-auto pc:p-[20px] flex justify-start items-start mobile:flex-col">
      {/* 纯pc */}
      <div className="mobile:hidden w-[160px] box-border py-[20px] pr-[60px]">
        <CommonClassifyWidget></CommonClassifyWidget>
      </div>

      <CommonTitleBar></CommonTitleBar>
      <div className="pc:hidden w-full">
        <CommonClassifyWidget></CommonClassifyWidget>
      </div>

    </div>
  );
};

export default BlogsPage;
