"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getClientType } from "@/app/lib/client/clientType";
import CommonTitleBar from "./mobile/CommonTitleBar";

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
  return <CommonTitleBar></CommonTitleBar>;
}
