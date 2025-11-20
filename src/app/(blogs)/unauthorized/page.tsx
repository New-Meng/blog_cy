"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Unauthorized() {
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
      <h2 className="text-4xl font-bold mb-4">403 - 无权限访问</h2>
      <p className="text-lg mb-8">抱歉，您没有权限访问此页面。</p>
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
