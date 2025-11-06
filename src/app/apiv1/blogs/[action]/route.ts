import prisma from "@/app/lib/server/db";
import { withApiHandler } from "@/app/lib/server/api-handler";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) => {
  const { action } = await params;

  switch (action) {
    case "list":
      const url = new URL(request.url);
      const pageNo = Number(url.searchParams.get("pageNo") || 1);
      const title = url.searchParams.get("title") || "";
      const pageSize = 2;
      console.log(pageNo, pageSize, "++??pagination");

      const PasimaWhereObj = title
        ? {
            title: {
              contains: title, // 类似 SQL 的 LIKE '%关键词%'
              // mode: "insensitive", // 不区分大小写 报错 可能不存在这个方法
            },
          }
        : {};

      const res = await prisma.post.findMany({
        take: pageSize,
        skip: (pageNo - 1) * pageSize,
        where: { ...PasimaWhereObj },
        orderBy: {
          createdAt: "desc", // 按创建时间降序排列（最新在前）
        },
      });
      const totalPosts = await prisma.post.count({
        where: { ...PasimaWhereObj },
      });
      const returnRes = {
        list: res,
        total: totalPosts,
        pageSize: pageSize,
        pageNo: pageNo,
      };

      return withApiHandler(() => Promise.resolve(returnRes), "成功");

    default:
      return withApiHandler(() => Promise.reject(), "Not Font 404");
  }
};
