"use client";
import "@ant-design/v5-patch-for-react-19";
import message from "antd/es/message";
import dynamic from "next/dynamic";
import { AsyncButton } from "@/components/client/AsyncButton";

import Form from "antd/es/form";
import { _$fetch } from "@/app/lib/client/fetch";
import { useState } from "react";
import CustomEditor from "../../components/CustomEditor";
import { useRouter } from "next/navigation";
import { ConfigProvider } from "antd";

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
const CreatePostPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const handlePublish = async () => {
    const formData = form.getFieldsValue();
    let params = {
      ...formData,
    };
    console.log(formData, "++??");

    const res = await _$fetch.post("apiv1/mypost/createpost", {
      body: params,
      token: true,
    });
    console.log(res, "++??res");
    if (res.success) {
      message.success("发布成功！");
      router.back();
    } else {
      message.error(res.message);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            /* 这里是你的组件 token */
            labelColor: "#ffffff",
          },
        },
      }}
    >
      <div className="w-full h-full">
        <div className="flex justify-end items-center mobile:px-[20px]">
          <AsyncButton className="my-5" onClick={handlePublish}>
            发布
          </AsyncButton>
        </div>

        <div className="mobile:w-full h-full pc:w-[1200] pb-5 px-[20px] pc:margin-[0__auto]">
          <Form form={form} labelCol={{ span: 3 }}>
            <Form.Item
              label="文章标题"
              name="acticleTitle"
              rules={[{ required: true, message: "文章标题必须填写" }]}
            >
              <Input></Input>
            </Form.Item>

            <Form.Item label="是否公开" name="published">
              <Switch></Switch>
            </Form.Item>

            <Form.Item
              help={
                <span style={{ color: "#ff4d4f" }}></span>
              }
              label="文章内容"
              name="content"
              rules={[{ required: true, message: "文章内容必须填写" }]}
            >
              {/* <Input type="textaera"></Input> */}
              <CustomEditor></CustomEditor>
            </Form.Item>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CreatePostPage;
