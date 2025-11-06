import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white default-bg dark:default-dark-bg bg-no-repeat bg-cover bg-center">
      <h2 className="text-4xl font-bold mb-4">403 - 无权限访问</h2>
      <p className="text-lg mb-8">抱歉，您没有权限访问此页面。</p>
      <Link href="/blogs" className="text-white underline hover:underline">
        返回首页
      </Link>
    </div>
  );
}
