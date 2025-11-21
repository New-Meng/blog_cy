"use client";
import React, { useEffect, useState } from "react";
import CustomTextArea from "../customTextArea";
import CustomInput from "../customInput";
import { AsyncButton } from "../AsyncButton";
import { message } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { _$fetch } from "@/app/lib/client/fetch";
import { useCommentContext } from "@/app/(blogs)/(blogs)/(posts)/post-view/CommentProvider";

type CommentPropsType = {
  postId: number;
};

const CustomComment = ({ postId }: CommentPropsType) => {
  const { parentId, parentName, setParentId, setParentName } =
    useCommentContext() || {};

  const [messageApi, contextHolder] = message.useMessage();

  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [content, setContent] = useState("");

  const submitComment = async () => {
    // 调用添加评论接口 comment/create
    const params = {
      visitorName,
      visitorEmail,
      content: content,
      postId,
      parentId,
    };

    const res = await _$fetch.post("apiv1/comment/create", {
      body: params,
    });
    if (!res.success) throw new Error(res.message || "评论提交失败");
    messageApi.success("评论提交成功");
  };

  useEffect(() => {
    console.log(parentId, parentName, "++??effect");
  }, [parentId]);
  return (
    <>
      {contextHolder}
      <div className="px-2 w-full box-border p-2">
        <div className="p-3 bg-white rounded-sm">
          <div className="flex justify-start items-start h-[25px] text-sm px-3">
            <div className="mr-2">
              {parentId ? `回复${parentName}：` : "留言"}
            </div>
            {parentId && (
              <div onClick={() => setParentId?.("")}>
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
