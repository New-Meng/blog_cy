import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
  analyzerMode: "server",
  analyzerPort: 8888,
});

const nextConfig: NextConfig = {
  /* config options here */
  // basePath: '/v1',
  api: {
    bodyParser: false, // 可选配置
    externalResolver: true, // 可选配置
    // 指定 API 路由的基础路径
    path: '/api' // 这将使 API 路由从 /api 而不是 /api 开始
  },

  // 指定需要 转译的 node_modules 包
  transpilePackages: ["antd"],

  images: {
    domains: ["cdn2.thecatapi.com"], // 添加允许的图片域名
  },

  // 开发模式下，打印fetch的调用结果
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

// 这里配置的是 打包后的分析
module.exports = withBundleAnalyzer(nextConfig);

// export default nextConfig;
