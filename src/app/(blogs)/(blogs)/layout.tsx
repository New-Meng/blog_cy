import type { Metadata } from "next";

import TitleBar from "./components/titleBar";
import BottomBar from "./components/bottomBar";
import ContentLayout from "./components/contentLayout";

export const metadata: Metadata = {
  title: "首页",
  description: "Blog Home",
};

export default function BlogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* 这里可以添加blogs路径特有的布局元素，如导航栏等 */}
      <div className="w-full h-full overflow-hidden">
        <TitleBar></TitleBar>
        <ContentLayout>{children}</ContentLayout>
        <BottomBar></BottomBar>
      </div>
    </>
  );
}
