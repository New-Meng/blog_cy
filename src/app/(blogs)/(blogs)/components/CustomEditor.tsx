"use client";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  // MDXEditor,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  linkPlugin,
  imagePlugin,
  InsertImage,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useEffect, useRef, useState } from "react";

import styles from "./styles.module.css";
import dynamic from "next/dynamic";

// 坑："use client" 组件，在服务端也会执行，只不过 useEffect等方法，只会在客户端执行
// 如果 客户端组件，内部的其他组件，有使用 随机数 、 WindowAPI  时间戳 那么服务端渲染会报错
// 如果有时间戳，随机数，初始赋值 null ,然后在 useEffect中赋值即可避免初始水合异常
const MDXEditor = dynamic(
  () =>
    import("@mdxeditor/editor").then((mod) => {
      // 可以在这里配置插件等
      return mod.MDXEditor;
    }),
  {
    ssr: false,
  }
);

type EditorEnterParams = {
  onChange?: (val: string) => void;
  readonly?: boolean;
  content?: string;
  options?: {
    minHeight?: string;
    maxHeight?: string;
  };
};

const CustomEditor = ({
  onChange,
  readonly = false,
  content = "",
  options,
}: EditorEnterParams) => {
  const [editorContent, setEditContent] = useState<string>("");
  const editorRef = useRef<MDXEditorMethods>(null);

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    const response = await fetch("/uploads/new", {
      method: "POST",
      body: formData,
    });
    const json = (await response.json()) as { url: string };
    return json.url;
  };

  useEffect(() => {
    if (content) {
      console.log(content, "++??content");
      editorRef.current?.setMarkdown(content);
    }
  }, [content]);
  return readonly ? (
    <div className="w-full">
      <MDXEditor
        className="w-full"
        markdown={content}
        readOnly={true}
        onChange={() => {}} // 空函数防止警告
      />
    </div>
  ) : (
    <div
      style={{
        minHeight: options?.minHeight ? options?.minHeight : "400px",
        maxHeight: options?.maxHeight ? options?.maxHeight : "",
      }}
      className={
        styles["my-classname"] +
        "w-full border-solid border-1 border-[#bbb] rounded-md"
      }
    >
      <MDXEditor
        ref={editorRef}
        className="w-full"
        markdown={editorContent}
        onChange={(val) => {
          console.log({ kk: val }, "++??valEditorChange");

          if (onChange) {
            onChange(val);
          }
          console.log(val);
          setEditContent(val);
        }}
        plugins={[
          // Example Plugin Usage
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          linkPlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarClassName: "my-classname",
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <InsertImage />
              </>
            ),
          }),
          imagePlugin({
            imageUploadHandler: async (image: File) => {
              return await uploadImage(image);
            },
          }),
        ]}
      />
    </div>
  );
};

export default CustomEditor;
