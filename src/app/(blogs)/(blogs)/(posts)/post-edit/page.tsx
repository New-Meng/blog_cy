"use client";
import "@ant-design/v5-patch-for-react-19";
import message from "antd/es/message";
import dynamic from "next/dynamic";
import { AsyncButton } from "@/components/client/AsyncButton";

import Form from "antd/es/form";
import { _$fetch } from "@/app/lib/client/fetch";
import { useEffect, useState } from "react";
import CustomEditor from "../../components/CustomEditor";
import { useRouter, useSearchParams } from "next/navigation";
import { Tag } from "@prisma/client";
import { Select } from "antd";
import CommonTitleBar from "../../blogs/[[...slug]]/components/CommonTitleBar";
import CommonClassifyWidget from "../../blogs/[[...slug]]/components/CommonClassifyWidget";

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

interface TagListResponseData {
  list: Tag[];
  total: number;
  pageNo: number;
  pageSize: number;
}

const PostEditPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParam = useSearchParams();
  const [tagOptions, setTagOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);

  const postsId = searchParam.get("postId");

  const handleEditPublish = async () => {
    const formData = form.getFieldsValue();
    let params = {
      ...formData,
      id: postsId,
    };
    console.log(formData, "++??");
    // \n\n 转化br标签为<br />
    params.content = params.content.replace(/\n\n/g, "<br />");

    const res = await _$fetch.post("apiv1/mypost/editpost", {
      body: params,
    });
    console.log(res, "++??res");
    if (res.success) {
      message.success("发布成功！");
      router.back();
    } else {
      message.error(res.message);
    }
  };

  const init = async () => {
    const res = await _$fetch.get(`apiv1/mypost/detail?postsId=${postsId}`);
    if (res.code !== 200) {
      message.error(res.message);
    } else {
      form.setFieldsValue(res.data);
    }
  };

  const getTagList = async () => {
    const res = await _$fetch.get<TagListResponseData>("apiv1/admin/tag/list");
    if (res.success) {
      if (res.data.list && res.data.list.length) {
        setTagOptions(
          res.data.list.map((item) => ({
            label: item.tagName,
            value: item.id,
          }))
        );
      }
    }
  };

  const content = Form.useWatch("content", form);

  useEffect(() => {
    init();
    getTagList();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="mobile:p-[20px]  my-5 flex justify-end items-center">
        <AsyncButton onClick={handleEditPublish}>发布修改</AsyncButton>
      </div>

      <div className="mobile:p-[20px]  mobile:w-full w-[1200] h-full margin-[0__auto]">
        <Form form={form} labelCol={{ span: 3 }}>
          <Form.Item
            label="文章标题"
            name="title"
            rules={[{ required: true, message: "文章标题必须填写" }]}
          >
            <Input></Input>
          </Form.Item>

          <Form.Item label="是否公开" name="published">
            <Switch></Switch>
          </Form.Item>

          <Form.Item label="文章标签" name="tagIds">
            <Select mode="multiple" options={tagOptions}></Select>
          </Form.Item>

          <Form.Item
            label="文章内容"
            name="content"
            rules={[{ required: true, message: "文章内容必须填写" }]}
          >
            {/* <Input type="textaera"></Input> */}
            <CustomEditor content={content}></CustomEditor>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PostEditPage;
