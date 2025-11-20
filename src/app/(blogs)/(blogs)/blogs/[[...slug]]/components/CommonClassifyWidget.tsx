import React from "react";
import Link from "next/link";

import { HOME_PAGE } from "@/app/lib/constant";

const CommonClassifyWidget: React.FC = () => {
  return (
    <div className="mobile:h-full h-auto flex flex-col justify-center items-center">
      <div className="w-full mobile:h-[40px] pc:py-[15px] flex pc:flex-col justify-center items-center gap-3 bg-transparent mobile:text-white border-t-[1px] border-t-[#fff] mobile:border-t-solid">
        <Link
          href={{
            pathname: HOME_PAGE + "/ACG",
            query: {
              pageNo: 1,
            },
          }}
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          ACG
        </Link>
        <Link
          href="/blogs"
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          学习
        </Link>
        <Link
          href="/blogs"
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          软件
        </Link>
        <Link
          href="/blogs"
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          游戏
        </Link>
        <Link
          href="/blogs"
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          其他
        </Link>
      </div>
      <div className="w-full mobile:h-[40px] pc:pt-[15px] flex pc:flex-col justify-center items-center gap-3 bg-transparent mobile:text-white border-t-[1px] border-t-[#fff] mobile:border-t-solid">
        <Link
          href="/blogs"
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          RSS
        </Link>
        <Link
          href="/blogs"
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          Pixiv
        </Link>
        <Link
          href="/blogs"
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          AI女友
        </Link>
        <Link
          href="/blogs"
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          魔法喵
        </Link>
        <Link
          href="/blogs"
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          归档
        </Link>
        <Link
          href="/blogs"
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          关于
        </Link>
        <Link
          href="/blogs"
          className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
        >
          留言
        </Link>
      </div>
    </div>
  );
};

export default CommonClassifyWidget;
