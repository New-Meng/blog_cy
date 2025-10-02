"use client";
import React, { useEffect, useState } from "react";

import { _$fetch } from "@/app/lib/client/fetch";
import CommonTitleBar from "./components/mobile/CommonTitleBar";

const EmptyArticle = () => {
  return (
    <div className=" w-full min-h-[calc(100vh__-__200px)] flex items-center justify-center border-[1px]">
      数据为空
    </div>
  );
};

const BlogsPage = () => {
  return (
    <>
      <CommonTitleBar></CommonTitleBar>
    </>
  );
};

export default BlogsPage;
