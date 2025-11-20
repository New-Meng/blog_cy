"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function NotFound() {
  const [routing, setRouting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleGotoPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (routing) {
      return;
    }
    setRouting(true);
    router.push("/blogs");
  };

  useEffect(() => {
    console.log(searchParams, pathname, "++??");
    setRouting(false);
  }, [searchParams, pathname]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white default-bg dark:default-dark-bg bg-no-repeat bg-cover bg-center">
      <h2 className="text-4xl font-bold mb-4">404 - 页面未找到</h2>
      <p className="text-lg mb-8">抱歉，您访问的页面不存在。</p>
      <Link
        href="/"
        className="text-white underline hover:underline"
        onClick={handleGotoPage}
      >
        返回首页
      </Link>
      {routing && (
        <span className="mt-2 text-sm opacity-80">少女祈祷中...</span>
      )}
    </div>
  );
}
