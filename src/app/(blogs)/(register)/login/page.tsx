"use client";
import "@ant-design/v5-patch-for-react-19";
import dynamic from "next/dynamic";
import Form from "antd/es/form";
import { useRouter } from "next/navigation";
import { GithubOutlined } from "@ant-design/icons";
import { Space, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import message from "antd/es/message";

import { AsyncButton } from "@/components/client/AsyncButton";
import CustomInput from "@/components/client/CustomInput";

import { _$fetch } from "@/app/lib/client/fetch";
import { useState } from "react";

// const Input = dynamic(() =>
//   import("antd/es/input").then((mod) => {
//     return mod;
//   })
// );

interface loginBackInterface {
  token: string;
  userInfo: Record<string, string>;
}

const LoginPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passWord, setPassWord] = useState("");
  const [userName, setUserName] = useState("");

  const handleLogin = async () => {
    const res = await _$fetch.post<loginBackInterface>("apiv1/login/default", {
      method: "POST",
      body: {
        userNameOrMobile: userName,
        password: passWord,
      },
    });
    console.log(res, "++??res");

    if (res.success) {
      if (res.data && res.data?.token) message.success("登录成功!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
      router.replace("/blogs");
    } else {
      message.error(res.message || "登陆失败");
    }
  };

  return (
    <div className="relative w-[100vw] h-[100vh] default-bg dark:default-bg-dark mobile:pt-[100px]">
      <div
        style={{
          boxShadow:
            "0 0 8px 2px #91C8E9, 0 0 3px 1px rgba(255, 255, 255, 0.8)",
        }}
        className="pc:absolute pc:top-[calc(50%__-__250px)] pc:left-1/2 mobile:m-auto p-[20px] w-[500px] mobile:w-[calc(100%__-__40px)] mobile:mx-[20px] h-[400px] border-[1px] border-solid border-[#91C8E9] rounded-[10px]"
      >
        <div className="mb-10 text-[32px] text-white text-center">登录</div>

        <CustomInput
          onChange={(val) => {
            setUserName(val);
          }}
          className="mb-5"
          label="账号"
          holderColor="#C0BCD8"
          activeBorderColor="#ffffff"
          placeholder="请输入用户邮箱/手机号"
        ></CustomInput>

        <CustomInput
          eyes={true}
          label="密码"
          activeBorderColor="#ffffff"
          placeholder="请输入密码"
          holderColor="#C0BCD8"
          onChange={(val) => {
            setPassWord(val);
          }}
        ></CustomInput>

        <div className="w-full h-[80px] flex justify-center items-center">
          <AsyncButton
            type="primary"
            className="text-[#fff]"
            onClick={async () => {
              await handleLogin();
              // router.push("/blogs");
            }}
          >
            登录
          </AsyncButton>
        </div>

        <Space className="w-full justify-center">
          <GithubOutlined />
        </Space>

        <Space className="w-full flex justify-center">
          <AsyncButton
            className="text-[#fff]"
            type="link"
            onClick={() => {
              console.log("注册账号");
              router.push("/signup");
            }}
          >
            注册账户
          </AsyncButton>
          <AsyncButton
            className="text-[#fff]"
            type="link"
            onClick={() => {
              console.log("忘记密码");
            }}
          >
            忘记密码
          </AsyncButton>
        </Space>
      </div>
    </div>
  );
};

export default LoginPage;
