"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";

const Popover = dynamic(() => import("antd/es/popover").then((mod) => mod), {
  ssr: false, // 重要：禁用服务端渲染，因为 Antd 依赖浏览器环境
  loading: () => null, // 可选：加载时的占位符
});

const navItems = [
  { name: "首页", href: "/blogs" },
  { name: "分类", href: "/categories" },
  { name: "标签", href: "/tags" },
  { name: "我的发布", href: "/mypost" },
];

const userMenu = [
  { name: "个人中心", href: "/user" },
  { name: "设置", href: "/settings" },
  { name: "退出登录", href: "/logout" },
];

export default function TitleBar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 h-[65px] w-full flex items-center justify-between px-6 py-4 bg-white shadow">
      {/* 导航栏 */}
      <nav className="flex space-x-6 ml-10">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            {item.name}
          </a>
        ))}
      </nav>
      {/* 用户头像及下拉菜单 */}
      <div className="relative mr-10">
        <Popover
          open={menuOpen}
          content={userMenu.map((item) => {
            return (
              <div
                key={item.name}
                className="block px-[25px] py-2 text-center text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  router.push("/user");
                  setMenuOpen(false);
                }}
              >
                {item.name}
              </div>
            );
          })}
        >
          <button
            className="flex items-center focus:outline-none"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <Image
              src={""}
              alt="用户头像"
              className="w-8 h-8 rounded-full border"
            />
          </button>
        </Popover>
      </div>
    </header>
  );
}
