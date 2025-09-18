"use client";
import { _$fetch } from "@/app/lib/client/fetch";
import { useEffect } from "react";
import { AsyncButton } from "@/components/client/AsyncButton";
import { useRouter } from "next/navigation";

const MyPostPage = () => {
  const router = useRouter();
  const getList = async () => {
    const res = await _$fetch.get("/apiv1/mypost/list?userId=123");
  };

  const gotoRelease = () => {
    router.push("/createpost");
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="w-full h-full">
      <AsyncButton onClick={gotoRelease}>发表文章</AsyncButton>
    </div>
  );
};

export default MyPostPage;
