"use client";

import Form from "antd/es/form";
import dynamic from "next/dynamic";
const Input = dynamic(() =>
  import("antd/es/input").then((mod) => {
    return mod;
  })
);
const Button = dynamic(() =>
  import("antd/es/button").then((mod) => {
    return mod;
  })
);

const ClientFormComponent = () => {
  const [form] = Form.useForm();
  const formRules = {
    username: [{ required: true, message: "请输入用户昵称!" }],
    gmail: [{ required: true, message: "请输入用户昵称!" }],
    password: [{ required: true, message: "请输入用户密码!" }],
    againPassword: [{ required: true, message: "请重复输入用户密码!" }],
  };
  const submit = async () => {
    await form.validateFields();
    let res = await fetch(`apiv1/signup/register?userId=123`, {
      method: "POST",
      body: JSON.stringify(form.getFieldsValue()),
    });
    let tempData = await res.json();
    console.log(res, tempData, "++??res");
  };
  return (
    <div>
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item label="用户昵称" name="username" rules={formRules.username}>
          <Input placeholder="请输入称"></Input>
        </Form.Item>
        <Form.Item label="邮箱" name="gmail" rules={formRules.gmail}>
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
        <Button
          className="w-[200px]"
          type="primary"
          onClick={() => {
            submit();
          }}
        >
          注册
        </Button>
      </div>
    </div>
  );
};

export default ClientFormComponent;
