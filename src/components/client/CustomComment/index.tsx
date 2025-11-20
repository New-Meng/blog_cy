"use client";
import React, { useState } from "react";
import CustomTextArea from "../customTextArea";
import CustomInput from "../customInput";
import { AsyncButton } from "../AsyncButton";
import { message } from "antd";

const CustomComment = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");

  const submitComment = async () => {
    // 提交评论的逻辑
    const userCookie = document.cookie
    if (!visitorName || (!visitorEmail && userCookie)) {
      console.log(visitorName, visitorEmail, "++??visitorName, visitorEmail");
      messageApi.warning("请输入用户名称和邮箱");
      return;
    }

    // 调用发布接口
  };
  return (
    <>
      {contextHolder}
      <div className="px-2 w-full box-border p-2">
        <div className="p-3 bg-white rounded-sm">
          <CustomTextArea
            borderColor="#3b82f6"
            placeholder="请输入评论内容"
            rows={6}
            height={200}
          ></CustomTextArea>

          <div className="box-border px-3 w-full h-[40px] flex justify-between items-center gap-[20px]">
            <div className="flex justify-start items-center gap-[20px]">
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
