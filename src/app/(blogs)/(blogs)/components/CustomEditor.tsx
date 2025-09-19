"use client";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  linkPlugin,
  imagePlugin,
  InsertImage,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useState } from "react";

type EditorEnterParams = {
  onChange?: (val: string) => void;
  readonly?: boolean;
  content?: string;
};

const CustomEditor = ({
  onChange,
  readonly = false,
  content = "123",
}: EditorEnterParams) => {
  const [editorContent, setEditContent] = useState<string>("");
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
    <div className="w-full h-[500px] border-solid border-1 border-[#bbb]">
      <MDXEditor
        className="w-full"
        markdown={editorContent}
        onChange={(val, aa) => {
          if (onChange) {
            onChange(val);
          }

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
