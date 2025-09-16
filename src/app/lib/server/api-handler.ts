import { NextResponse } from "next/server";

export async function withApiHandler<T>(
  handler: () => Promise<T>,
  successMessage?: string
) {
  try {
    const data = await handler();
    return NextResponse.json({
      success: true,
      message: successMessage,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        success: false,
        message: error instanceof Error ? error.message : "未捕获的错误",
      },
      { status: 200 }
    );
  }
}
