import { NextResponse } from "next/server";
import { ResponseResBaseType } from "../client/fetch/types";

type respeseType = {
  code?: number;
};

export async function withApiHandler<T>(
  handler: () => Promise<T>,
  successMessage?: string,
  options: respeseType = {}
): Promise<NextResponse> {
  try {
    const data = await handler();
    return NextResponse.json({
      success: true,
      message: successMessage,
      data,
      code: options.code || 200,
    });
  } catch (error) {
    let errorMessage = "";
    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log(error, "++??kk");
      errorMessage = "未捕获的异常";
    }

    return NextResponse.json(
      {
        code: options.code || 500,
        success: false,
        message: errorMessage,
      },
      { status: 200 }
    );
  }
}
