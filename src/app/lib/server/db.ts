// 1、执行 pnpm dlx prisma init 初始化配置文件 如 root/prisma
// 2、 执行 pnpm dlx prisma generate  生成prisma客户端
import { PrismaClient } from "@prisma/client";

// 初始化Prisma
const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "event" }, // 发送query事件
    { level: "info", emit: "stdout" }, // 打印到控制台
    { level: "warn", emit: "stdout" },
    { level: "error", emit: "stdout" },
  ],
});

// 监听query事件，打印SQL和耗时
prisma.$on("query", (e) => {
  console.log(`[SQL] ${e.query}`);
  console.log(`[Params] ${e.params}`);
  console.log(`[Took] ${e.duration}ms`);
});

export default prisma;
