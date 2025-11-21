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

type validateResType = {
  success: boolean;
  message?: string;
  body?: any;
};
export const validateRequestBody = async (
  request: Request
): Promise<validateResType> => {
  let text = "";
  try {
    text = await request.clone().text();
  } catch (e) {
    return {
      success: false,
      message: "读取请求体失败",
    };
  }

  if (!text || text.trim() === "") {
    return {
      success: false,
      message: "Request body is empty",
    };
  }

  try {
    const json = JSON.parse(text);
    return {
      success: true,
      message: "",
      body: json,
    };
  } catch {
    return {
      success: false,
      message: "Request body is not valid JSON",
      body: text,
    };
  }
};
