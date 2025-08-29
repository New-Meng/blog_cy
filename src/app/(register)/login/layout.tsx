import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "用户中心",
  description: "用户的个人信息页",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* 这里可以添加blogs路径特有的布局元素，如导航栏等 */}
      {children}
    </>
  );
}
