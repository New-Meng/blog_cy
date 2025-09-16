"use client";
import React, { useEffect } from "react";

import { _$fetch } from "@/app/lib/client/fetch";

const BlogsPage = () => {
  const testList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const getListActicle = async () => {
    const res = await _$fetch.post("blogs/list");
    console.log(res, "++??");
  };

  useEffect(() => {
    getListActicle();
  }, []);
  return (
    <div className="w-full h-full">
      {testList.map((item, index) => {
        return (
          <div key={index} className="w-full h-[200px] mb-10">
            {item}
          </div>
        );
      })}
    </div>
  );
};

export default BlogsPage;
