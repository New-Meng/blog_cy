import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/lib/server/auth";

// 需要校验token的路由页面
const protectedRoutes = ["/createpost"];

// 全局中间件，页面访问，也会触发，慎用
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (protectedRoutes.includes(pathname)) {
    const tokenVlidate = await verifyToken(request);
    if (tokenVlidate.code == 200) {
      return NextResponse.next();
    } else {
      // token 验证失败，则页面重定向
      return NextResponse.rewrite(new URL("/unauthorized", request.url));
    }
  } else {
    return NextResponse.next();
  }
}

// 设置匹配路径
// export const config = {
//   matcher: "/blogs/path*",
// };
