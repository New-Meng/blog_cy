import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "注册",
  description: "注册用户页面",
  keywords: ["注册"],
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
