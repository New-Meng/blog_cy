import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// 全局中间件，页面访问，也会触发，慎用
// 中间件可以是 async 函数，如果使用了 await
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// 设置匹配路径
// export const config = {
//   matcher: "/blogs/path*",
// };
