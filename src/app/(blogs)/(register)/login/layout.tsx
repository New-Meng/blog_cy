import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登录",
  description: "登录页面",
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
