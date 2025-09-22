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
import { useEffect, useRef, useState } from "react";

type EditorEnterParams = {
  onChange?: (val: string) => void;
  readonly?: boolean;
  content?: string;
  options?: {
    minHeight?: string;
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
        minHeight: options?.minHeight ? options.minHeight : "500px",
      }}
      className="w-full border-solid border-1 border-[#bbb]"
    >
      <MDXEditor
        ref={editorRef}
        className="w-full"
        markdown={editorContent}
        onChange={(val) => {
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
