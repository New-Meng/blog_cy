import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white default-bg dark:default-dark-bg bg-no-repeat bg-cover bg-center">
      <h2 className="text-4xl font-bold mb-4">404 - 页面未找到</h2>
      <p className="text-lg mb-8">抱歉，您访问的页面不存在。</p>
      <Link href="/" className="text-white underline hover:underline">
        返回首页
      </Link>
    </div>
  );
}
