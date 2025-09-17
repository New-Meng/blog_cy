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

  const handleLogin = async () => {
    const res = await _$fetch.post<loginBackInterface>("apiv1/login/default", {
      method: "POST",
      body: form.getFieldsValue(),
    });
    console.log(res, "++??res");

    if (res.success) {
      if (res.data && res.data?.token) message.success("登录成功!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
      localStorage;
      router.replace("/blogs");
    } else {
      message.error(res.message || "登陆失败");
    }
  };

  return (
    <div className="relative w-100vw h-100vh">
      <div className="absolute top-[200px] right-[150px] p-[20px] w-[500px] h-[400px] border-[1px] border-solid border-[#cccccc]">
        <div className="mb-10 text-[32px] text-center">登录</div>
        <Form form={form} labelCol={{ span: 6 }}>
          <Form.Item label="账号" name="userNameOrMobile">
            <Input placeholder="请输入用户邮箱/手机号"></Input>
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input.Password placeholder="请输入密码"></Input.Password>
          </Form.Item>
        </Form>

        <div className="w-full h-[80px] flex justify-center items-center">
          <AsyncButton
            type="primary"
            className="w-[280px] h-[60px]"
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
            type="link"
            onClick={() => {
              console.log("注册账号");
              router.push("/signup");
            }}
          >
            注册账户
          </AsyncButton>
          <AsyncButton
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
