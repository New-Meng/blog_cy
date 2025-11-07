"use client";
import "@ant-design/v5-patch-for-react-19";
import message from "antd/es/message";
import dynamic from "next/dynamic";
import Form from "antd/es/form";
import { _$fetch } from "@/app/lib/client/fetch";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CustomEditor from "../../components/CustomEditor";
import { AsyncButton } from "@/components/client/AsyncButton";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal } from "antd";

const Input = dynamic(() =>
  import("antd/es/input").then((mod) => {
    return mod;
  })
);

const Switch = dynamic(() =>
  import("antd/es/switch").then((mod) => {
    return mod;
  })
);

type DetailType = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  likeCount: number;
  favoriteCount: number;
};

const PostDetailPage = () => {
  const router = useRouter();
  const [detail, setDetail] = useState<DetailType>();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const searchParam = useSearchParams();
  const postsId = searchParam.get("postId");

  const init = async () => {
    const res = await _$fetch.get<DetailType>("apiv1/mypost/detail", {
      params: { postsId: postsId || "" },
      catch: true,
    });
    console.log(res, "++??res");
    if (res.code == 200) {
      setDetail(res.data);
      console.log("init", res.data);
    } else {
      message.error(res.message);
    }
  };

  const goToEdit = () => {
    router.push(`/post-edit?postId=${detail?.id}`);
  };

  const handleDelete = async () => {
    setConfirmLoading(true);
    try {
      const res = await _$fetch.delete(
        `apiv1/mypost/delete?postId=${detail?.id}`
      );
      if (res.code == 200) {
        message.success("删除成功");
        setOpen(false);
        router.back();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error("删除失败");
    }

    setConfirmLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="w-[full] pc:w-[1200] h-full margin-[0__auto]">
        <div className="flex justify-end items-center h-[50px] gap-[20px] box-content pr-[20px]">
          <div
            className="cursor-pointer hover:text-[#2381FF]"
            onClick={goToEdit}
          >
            <EditOutlined /> 编辑
          </div>

          <div
            className="cursor-pointer hover:text-[#FF4D4F]"
            onClick={() => {
              setOpen(true);
            }}
          >
            <DeleteOutlined /> 删除
          </div>
        </div>
        <div>
          <div className="p-2 text-[18px] font-bold">{detail?.title}</div>

          {detail?.content && (
            <CustomEditor
              readonly={true}
              content={detail?.content}
              options={{ minHeight: "500px" }}
            ></CustomEditor>
          )}
        </div>
      </div>

      <Modal
        open={open}
        title="提示"
        confirmLoading={confirmLoading}
        onOk={handleDelete}
        onCancel={() => {
          setOpen(false);
        }}
      >
        是否删除当前文章?
      </Modal>
    </div>
  );
};

export default PostDetailPage;
