"use client";
import { Pagination, PaginationProps } from "antd";
import styles from "./Pagination.module.css";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const NoDataWidget = () => {
  return (
    <div className="flex justify-center items-center text-[#fff]">
      没有数据哦~~
    </div>
  );
};

const PaginationWidget = (props: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [routing, setRouting  ] = useState(false);

  const onPageNoChange = (pageNo: number) => {
    console.log(pageNo, "++??pageNo");
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageNo", pageNo.toString());
    router.push(`${pathname}?${params.toString()}`);
    setRouting(true);
  };

  useEffect(() => {
    setRouting(false);
  }, [pathname, searchParams]);

  return (
    <div className={styles["custom-pagination"]}>
      {props?.total ? (
        <Pagination
          onChange={onPageNoChange}
          showSizeChanger={props?.showSizeChanger || false}
          {...props}
        ></Pagination>
      ) : (
        <NoDataWidget />
      )}
      {routing && (
        <div className="flex justify-center items-center text-[#7044C1]">
          少女祈祷中...
        </div>
      )}
    </div>
  );
};

export default PaginationWidget;
