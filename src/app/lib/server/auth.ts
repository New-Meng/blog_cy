// utils/auth.ts
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

interface VerifyTokenInterface {
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
  let token = req.cookies.get("Authorization")?.value; // 优先从cookie中获取token

  if (!token) {
    token = req.headers.get("Authorization") || ""; // 如果cookie中没有，则从Authorization头部获取
  }

  console.log(token, "++??token");

  if (!token) {
    return {
      success: false,
      data: "token 未传入",
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
        data: "Token expired",
        code: 403,
      };
    } else if (err?.code == "ERR_JWT_INVALID") {
      return {
        success: false,
        data: "Invalid token",
        code: 401,
      };
    } else {
      return {
        success: false,
        data: "身份验证，未知的错误",
        code: 400,
      };
    }
  }
};
