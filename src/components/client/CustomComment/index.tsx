"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomTextArea from "../customTextArea";
import CustomInput from "../customInput";
import { AsyncButton } from "../AsyncButton";
import { message } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { _$fetch } from "@/app/lib/client/fetch";
import { useCommentContext } from "@/app/(blogs)/(blogs)/(posts)/post-view/CommentProvider";

interface CommentSubmitParams {
  visitorName: string;
  visitorEmail: string;
  content: string;
  postId: number;
  rootId?: string; // 客户端的 rootId 可能是 string
  parentId?: string; // 客户端的 parentId 可能是 string
  tempApplyUserName?: string; // 回复的匿名用户名称
}

type CommentPropsType = {
  postId: number;
};

const CustomComment = ({ postId }: CommentPropsType) => {
  const { parentInfo, setParentInfo } = useCommentContext() || {};
  const router = useRouter();

  const [messageApi, contextHolder] = message.useMessage();

  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [content, setContent] = useState("");

  const submitComment = async () => {
    // 调用添加评论接口 comment/create

    const params: CommentSubmitParams & { applyUserId?: string } = {
      // 应用新接口
      visitorName,
      visitorEmail,
      content: content,
      postId,
      rootId: undefined, // 初始为 undefined
      parentId: parentInfo?.id,
      tempApplyUserName: parentInfo?.user?.username,
      applyUserId: parentInfo?.user?.id,
    };
    if (parentInfo?.rootId) {
      params.rootId = parentInfo.rootId;
    } else {
      params.rootId = parentInfo?.id;
    }
    const res = await _$fetch.post("apiv1/comment/create", {
      body: params,
    });
    if (!res.success) {
      console.log(res, "++??res");
      messageApi.error(res.message || "评论提交失败");
      throw new Error(res.message || "评论提交失败");
    }
    messageApi.success("评论提交成功");
  };
  useEffect(() => {
    console.log(parentInfo, "++??effect");
  }, [parentInfo]);

  return (
    <>
      {contextHolder}
      <div className="px-2 w-full box-border">
        <div className="p-3 bg-white rounded-sm">
          <div className="flex justify-start items-start h-[25px] text-sm px-3">
            <div className="mr-2">
              {parentInfo?.id
                ? `回复${
                    parentInfo.visitorName || parentInfo?.user?.username
                  }：`
                : "留言"}
            </div>
            {parentInfo?.id && (
              <div
                className="cursor-pointer"
                onClick={() => setParentInfo?.(null)}
              >
                <CloseCircleOutlined />
              </div>
            )}
          </div>
          <CustomTextArea
            value={content}
            onChange={setContent}
            borderColor="#3b82f6"
            placeholder="请输入评论内容"
            rows={6}
            height={200}
          ></CustomTextArea>

          <div className="box-border px-3 w-full pc:h-[40px] flex mobile:flex-col justify-between items-center mobile:items-end mobile: mt-3 gap-[20px]">
            <div className="flex pc:justify-start mobile:flex-col items-center gap-[20px] mobile:gap-[5px]">
              <div className="w-[200px]">
                <CustomInput
                  value={visitorName}
                  borderColor="#ff587cff"
                  activeBorderColor="#ff587cff"
                  placeholder="请输入用户名称"
                  holderColor="#FDAEC1"
                  onChange={(e) => setVisitorName(e)}
                ></CustomInput>
              </div>

              <div className="w-[200px]">
                <CustomInput
                  value={visitorEmail}
                  borderColor="#ff587cff"
                  activeBorderColor="#ff587cff"
                  placeholder="请输入用户邮箱"
                  holderColor="#FDAEC1"
                  onChange={(e) => setVisitorEmail(e)}
                ></CustomInput>
              </div>
            </div>

            <div>
              <AsyncButton onClick={submitComment}>提交评论</AsyncButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomComment;
