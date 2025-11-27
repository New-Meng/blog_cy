import React from "react";
import Link from "next/link";

import { MENU_LIST1, MENU_LIST2 } from "@/app/lib/constant";

const CommonClassifyWidget: React.FC = () => {
  return (
    <div className="mobile:h-full h-auto flex flex-col justify-center items-center">
      <div className="w-full mobile:h-[40px] pc:py-[15px] flex pc:flex-col justify-center items-center gap-3 bg-transparent mobile:text-white border-t-[1px] border-t-[#fff] mobile:border-t-solid">
        {MENU_LIST1.map((item) => {
          return (
            <Link
              prefetch={item?.noPrefetch ? true : false}
              href={{
                pathname: item.href,
                query: {
                  pageNo: 1,
                },
              }}
              className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
            >
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="w-full mobile:h-[40px] pc:pt-[15px] flex pc:flex-col justify-center items-center gap-3 bg-transparent mobile:text-white border-t-[1px] border-t-[#fff] mobile:border-t-solid">
        {MENU_LIST2.map((item) => {
          return (
            <Link
              prefetch={item?.noPrefetch ? true : false}
              href={{
                pathname: item.href,
                query: {
                  pageNo: 1,
                },
              }}
              className="pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2"
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CommonClassifyWidget;
