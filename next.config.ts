import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // basePath: '/v1',
  // api: {
  //   bodyParser: false, // 可选配置
  //   externalResolver: true, // 可选配置
  //   // 指定 API 路由的基础路径
  //   path: '/api' // 这将使 API 路由从 /api 而不是 /api 开始
  // },

  // 指定需要 转译的 node_modules 包
  transpilePackages: ["antd", "react", "react-dom"],

  images: {
    domains: ["cdn2.thecatapi.com"], // 添加允许的图片域名
  },

  // 开发模式下，打印fetch的调用结果
  logging: {
    fetches: {
      fullUrl: true,
    },
  },


  // 开发模式下，构建时缓存
  onDemandEntries: {
    // 页面在内存中缓存的时间（毫秒）
    maxInactiveAge: 25 * 1000 * 60 * 60, // 25小时
    // 同时保留的页面数
    pagesBufferLength: 2,
  },
};

export default nextConfig;
