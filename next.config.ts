import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
  analyzerMode: "server",
  analyzerPort: 8888,
});

const nextConfig: NextConfig = {
  /* config options here */

  // 指定需要 转译的 node_modules 包
  transpilePackages: ["antd"],

  images: {
    domains: ["cdn2.thecatapi.com"], // 添加允许的图片域名
  },
};

// 这里配置的是 打包后的分析
module.exports = withBundleAnalyzer(nextConfig);

// export default nextConfig;
