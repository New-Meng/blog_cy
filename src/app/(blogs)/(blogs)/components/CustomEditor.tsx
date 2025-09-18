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

const CustomEditor = () => {
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
  return (
    <>
      <MDXEditor
        className="border-[1px] border-solids border=[#bbb] h-min-[200px]"
        markdown={editorContent}
        onChange={setEditContent}
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
    </>
  );
};

export default CustomEditor;
