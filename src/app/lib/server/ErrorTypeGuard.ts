import { Prisma } from "@prisma/client";

type ReturnPrasimaErrorTypeGuard = {
  code: number;
  message: string;
};
// 用于处理prisma 的错误
const prasimaErrorTypeGuard = (error: unknown): ReturnPrasimaErrorTypeGuard => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      code: 1,
      message: `Prisma已知错误: ${error.code}`,
    };
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      code: 2,
      message: `Prisma未知错误: ${error.message}`,
    };
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      code: 3,
      message: `数据校验失败: ${error.message}`,
    };
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    console.log("Prisma 初始化失败:", error.message);
    return {
      code: 4,
      message: `Prisma初始化失败: ${error.message}`,
    };
  } else {
    return {
      code: 0,
      message: "非Prisma错误",
    };
  }
};

export default prasimaErrorTypeGuard;
