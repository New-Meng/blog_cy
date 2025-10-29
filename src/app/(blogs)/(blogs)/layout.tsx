import type { Metadata } from "next";

import TitleBar from "./components/titleBar";
import BottomBar from "./components/bottomBar";
import ContentLayout from "./components/contentLayout";
import { getClientType } from "@/app/lib/client/clientType";

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
      {/* bg-[url('/globalbg.webp1')] */}
      <div className="w-[100vw] h-[100vh] overflow-y-scroll text-primas default-bg dark:default-dark-bg bg-no-repeat bg-cover bg-center">
        <div className="pc:w-[1200px] pc:m-auto">
          {/* <TitleBar></TitleBar>
        <ContentLayout>{children}</ContentLayout>
        <BottomBar></BottomBar> */}
          {children}
        </div>
      </div>
    </>
  );
}
