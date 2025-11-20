// utils/auth.ts
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export interface VerifyTokenInterface {
  success: boolean;
  data: any;
  code: number;
}

/**
 * 验证 JWT Token
 * @param req Next.js 请求对象
 * @param res Next.js 响应对象
 * @returns 验证成功返回 decoded payload，失败返回 null
 */
export const verifyToken = async (
  req: NextRequest
): Promise<VerifyTokenInterface> => {
  // 从 cookie中获取 token
  let token = req.cookies.get("Authorization")?.value;

  console.log(token, "++??token");

  if (!token) {
    return {
      success: false,
      data: "当前页面需登录访问，请先登录",
      code: 401,
    };
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    return {
      success: true,
      data: payload,
      code: 200,
    };
  } catch (err: any) {
    console.log(err, "++??err");
    if (err?.code == "ERR_JWT_EXPIRED") {
      return {
        success: false,
        data: "登录过期，请重新登录",
        code: 403,
      };
    } else if (err?.code == "ERR_JWT_INVALID") {
      return {
        success: false,
        data: "token验证失败, 请重新登录",
        code: 401,
      };
    } else {
      return {
        success: false,
        data: "身份验证失败，未知的错误",
        code: 400,
      };
    }
  }
};
