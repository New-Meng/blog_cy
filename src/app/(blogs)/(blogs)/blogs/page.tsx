"use client";
import React, { useEffect, useState } from "react";

import { _$fetch } from "@/app/lib/client/fetch";

const EmptyArticle = () => {
  return (
    <div className="w-full h-[500px] flex items-center justify-center">
      数据为空
    </div>
  );
};

const BlogsPage = () => {
  const [articleList, setArticleList] = useState<any[]>([]);
  const getListActicle = async () => {
    const token = localStorage.getItem("token");
    const res = await _$fetch.get<any[]>("apiv1/blogs/list", {
      token: token || "",
    });

    setArticleList(res?.data || []);
  };

  useEffect(() => {
    getListActicle();
  }, []);
  return (
    <>
      {articleList.length ? (
        <div className="w-full h-full">
          {articleList.map((item, index) => {
            return (
              <div key={index} className="w-full h-[200px] mb-10">
                {item}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyArticle></EmptyArticle>
      )}
    </>
  );
};

export default BlogsPage;
