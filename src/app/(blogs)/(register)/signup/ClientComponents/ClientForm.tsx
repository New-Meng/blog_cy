"use client";
// antd 5 兼容 next15
import "@ant-design/v5-patch-for-react-19";
import message from "antd/es/message";
import Form from "antd/es/form";
import dynamic from "next/dynamic";
import { CreateUserDto } from "@/types/UserTypes";
import { AsyncButton } from "@/components/client/AsyncButton";

import { useRouter } from "next/navigation";
import { _$fetch } from "@/app/lib/client/fetch";

const Input = dynamic(() =>
  import("antd/es/input").then((mod) => {
    return mod;
  })
);

const ClientFormComponent = () => {
  const router = useRouter();
  const [form] = Form.useForm<CreateUserDto>();

  const formRules = {
    username: [{ required: true, message: "请输入用户昵称!" }],
    email: [{ required: true, message: "请输入用户邮箱!" }],
    password: [{ required: true, message: "请输入用户密码!" }],
    againPassword: [{ required: true, message: "请重复输入用户密码!" }],
  };
  const submit = async () => {
    await form.validateFields();

    const res = await _$fetch.post(`apiv1/signup/register`, {
      body: form.getFieldsValue(),
    });

    const tempData = res;

    if (tempData.success) {
      message.success("注册成功!");
      setTimeout(() => {
        router.replace("/login");
      }, 100);
    } else {
      message.error(tempData.message);
    }
  };
  return (
    <div>
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item label="用户昵称" name="username" rules={formRules.username}>
          <Input placeholder="请输入称"></Input>
        </Form.Item>
        <Form.Item label="邮箱" name="email" rules={formRules.email}>
          <Input placeholder="请输邮箱"></Input>
        </Form.Item>
        <Form.Item label="密码" name="password" rules={formRules.password}>
          <Input placeholder="请输密码"></Input>
        </Form.Item>
        <Form.Item
          label="重复密码"
          name="againPassword"
          rules={formRules.againPassword}
        >
          <Input placeholder="请重复输入密码"></Input>
        </Form.Item>
      </Form>

      <div className="w-full flex justify-center items-center">
        <AsyncButton
          className="h- w-[200px]"
          type="primary"
          onClick={async () => {
            await submit();
          }}
        >
          注册
        </AsyncButton>
      </div>
    </div>
  );
};

export default ClientFormComponent;
