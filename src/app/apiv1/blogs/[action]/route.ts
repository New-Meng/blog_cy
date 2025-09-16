import prisma from "@/app/lib/server/db";
import { withApiHandler } from "@/app/lib/server/api-handler";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) => {
  const { action } = await params;
  console.log(action, "++??action");
  switch (action) {
    case "list":
      console.log(request.json());
      return withApiHandler(() =>
        Promise.resolve({
          code: 200,
          message: "成功",
          success: true,
          data: [],
        })
      );

    default:
      return withApiHandler(() => Promise.reject(), "Not Font 404");
  }
};
