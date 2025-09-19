"use client";
import "@ant-design/v5-patch-for-react-19";
import message from "antd/es/message";
import { _$fetch } from "@/app/lib/client/fetch";
import { useEffect, useState } from "react";
import { AsyncButton } from "@/components/client/AsyncButton";
import { useRouter } from "next/navigation";
import { ResponseListType } from "@/app/lib/client/fetch/types";

type PostItemType = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  authorId: number;
  likeCount: number;
  favoriteCount: number;
};
type PostListType = PostItemType[];

const MyPostPage = () => {
  const router = useRouter();
  const [list, setList] = useState<PostListType>([]);
  const getList = async () => {
    const res = await _$fetch.get<ResponseListType<PostListType>>(
      "/apiv1/mypost/list",
      {
        token: true,
      }
    );
    if (res.code != 200) {
      message.error(res.message);
    } else {
      setList(res.data.list);
    }
  };

  const gotoRelease = () => {
    router.push("/createpost");
  };

  useEffect(() => {
    getList();
  }, []);

  return (
<<<<<<< HEAD
    <div className="w-full h-full p-[10px] box-content">
      <div className="flex justify-end items-center">
        <AsyncButton className="mb-5" onClick={gotoRelease}>
          发表文章
        </AsyncButton>
      </div>

      <div className="w-full h-full">
        {list.map((item) => {
          return (
            <div className="w-full h-[150px] border-[1px] border-solid border-[#bbb] box-content p-[10px]">
              <div className="text-[18px] font-bold my-2">{item.title}</div>
              <div className="text-[16px]">{item.content}</div>
            </div>
          );
        })}
      </div>
=======
    <div className="w-full h-full">
      <AsyncButton onClick={gotoRelease}>发表文章</AsyncButton>
>>>>>>> 04357c1fe93e4baf4397ad4d621da6938c3bea55
    </div>
  );
};

export default MyPostPage;
