"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { PostBaseInfo } from "./index";
const TitleText = ({ baseInfo }: { baseInfo?: PostBaseInfo }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [routing, setRouting] = useState(false);

  const gotoDetaile = () => {
    router.push(`/post-view?postId=${baseInfo?.postId}`);
    setRouting(true);
  };

  useEffect(() => {
    console.log(searchParams, pathname, "++??");
    setRouting(false);
  }, [searchParams, pathname]);
  return (
    <div
      className="flex items-center justify-start flex-wrap text-xl font-bold"
      onClick={gotoDetaile}
    >
      {(!routing && baseInfo?.title) || ""}
      {routing && <span className="text-xl underline">少女祈祷中...</span>}
    </div>
  );
};

export default TitleText;
