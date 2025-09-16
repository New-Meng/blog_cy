import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "todoList",
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
      <div className="w-full h-full">{children}</div>
    </>
  );
}
