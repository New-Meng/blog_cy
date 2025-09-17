// utils/auth.ts
import jwt, {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from "jsonwebtoken";

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
export const verifyToken = (req: Request): VerifyTokenInterface => {
  const token = req.headers.get("Authorization");

  if (!token) {
    return {
      success: false,
      data: "token 未传入",
      code: 401,
    };
  }

  try {
    return {
      success: true,
      data: jwt.verify(token, process.env.JWT_SECRET!),
      code: 200,
    };
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return {
        success: false,
        data: "Invalid token",
        code: 401,
      };
    } else if (err instanceof TokenExpiredError) {
      return {
        success: false,
        data: "Token expired",
        code: 403,
      };
    } else if (err instanceof NotBeforeError) {
      return {
        success: false,
        data: "Token not active",
        code: 403,
      };
    } else {
      return {
        success: false,
        data: "未知的错误",
        code: 400,
      };
    }
  }
};
