"use client";
import dynamic from "next/dynamic";
import Form from "antd/es/form";
import { useRouter } from "next/navigation";
import { GithubOutlined } from "@ant-design/icons";
import { Space } from "antd";
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

const LoginPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  return (
    <div className="relative w-100vw h-100vh">
      <div className="absolute top-[200px] right-[150px] p-[20px] w-[500px] h-[400px] border-[1px] border-solid border-[#cccccc]">
        <div className="mb-10 text-[32px] text-center">登录</div>
        <Form form={form} labelCol={{ span: 4 }}>
          <Form.Item label="用户名称" name="userName">
            <Input></Input>
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input></Input>
          </Form.Item>
        </Form>

        <div className="w-full h-[80px] flex justify-center items-center">
          <Button
            type="primary"
            className="w-[280px] h-[60px]"
            onClick={() => {
              router.push("/blogs");
              console.log(form.getFieldsValue(), "++??kk");
            }}
          >
            登录
          </Button>
        </div>

        <Space className="w-full justify-center">
          <GithubOutlined />
        </Space>

        <Space className="w-full flex justify-center">
          <Button
            type="link"
            onClick={() => {
              console.log("注册账号");
              router.push("/signup")
            }}
          >
            注册账户
          </Button>
          <Button
            type="link"
            onClick={() => {
              console.log("忘记密码");
            }}
          >
            忘记密码
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default LoginPage;
