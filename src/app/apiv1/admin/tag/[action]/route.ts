import {
  validateRequestBody,
  withApiHandler,
} from "@/app/lib/server/api-handler";
import { verifyToken } from "@/app/lib/server/auth";
import prisma from "@/app/lib/server/db";
import { NextRequest } from "next/server";
import { Prisma, UserRole } from "@prisma/client";

type FindManyTagArgs = {
  take?: number;
  skip?: number;
  orderBy: {
    id: Prisma.SortOrder;
  };
  select: {
    id: true;
    tagName: true;
    createdAt: true;
    updatedAt: true;
  };
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) => {
  const { action } = await params;

  // 管理平台，只有管理员可以登录
  const jwtValidate = await verifyToken(request);
  if (!jwtValidate.success) {
    return withApiHandler(() => Promise.reject(jwtValidate.data), "", {
      code: jwtValidate.code,
    });
  } else if (jwtValidate.data.role != UserRole.ADMIN) {
    return withApiHandler(() => Promise.reject("当前用户并非管理员"), "", {
      code: 403,
    });
  }
  const url = new URL(request.url);
  const pageNo = Number(url.searchParams.get("pageNo"));
  const pageSize = Number(url.searchParams.get("pageSize"));
  switch (action) {
    case "list": {
      try {
        const findModel: FindManyTagArgs = {
          orderBy: {
            id: "asc" as const,
          },
          select: {
            id: true,
            tagName: true,
            createdAt: true,
            updatedAt: true,
          },
        };
        if (pageNo && pageSize) {
          findModel.take = pageSize;
          findModel.skip = (pageNo - 1) * pageSize;
        }
        const res = await prisma.tag.findMany(findModel);
        const total = await prisma.tag.count({
          where: {},
        });
        const resultObj = {
          list: res,
          total: total,
          pageNo: pageNo,
          pageSize: pageSize,
        };
        return withApiHandler(() => Promise.resolve(resultObj));
      } catch (error) {
        return withApiHandler(() => Promise.reject(error));
      }
    }

    default: {
      return withApiHandler(() => Promise.reject(), "Not Font 404");
    }
  }
};

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) => {
  const { action } = await params;
  // 管理平台，只有管理员可以登录
  const jwtValidate = await verifyToken(request);
  if (!jwtValidate.success) {
    return withApiHandler(() => Promise.reject(jwtValidate.data), "", {
      code: jwtValidate.code,
    });
  } else if (jwtValidate.data.role != UserRole.ADMIN) {
    return withApiHandler(() => Promise.reject("当前用户并非管理员"), "", {
      code: 403,
    });
  }

  switch (action) {
    case "create": {
      try {
        const body = await validateRequestBody(request);
        if (!body.success && body.body.tagName) {
          return withApiHandler(() => Promise.reject("标签名称不能为空"));
        } else if (body.body.tagName.length > 50) {
          return withApiHandler(() =>
            Promise.reject("标签名称不能超过50个字符")
          );
        }
        const res = await prisma.tag.create({
          data: {
            tagName: body.body.tagName,
          },
        });
        if (!res?.id) {
          return withApiHandler(() => Promise.reject("创建标签失败"));
        } else {
          return withApiHandler(() => Promise.resolve(), "创建标签成功");
        }
      } catch (error) {
        return withApiHandler(() => Promise.reject(error));
      }
    }

    case "delete": {
      try {
        const body = await validateRequestBody(request);
        if (!body.success && body.body.id) {
          return withApiHandler(() => Promise.reject("标签ID不能为空"));
        }
        const res = await prisma.tag.delete({
          where: {
            id: body.body.id,
          },
        });
        return withApiHandler(() => Promise.resolve(), "删除标签成功");
      } catch (error) {
        return withApiHandler(() => Promise.reject(error));
      }
    }

    case "update": {
      try {
        const body = await validateRequestBody(request);
        if (!body.success && body.body.id) {
          return withApiHandler(() => Promise.reject("标签ID不能为空"));
        }
        if (!body.success && body.body.tagName) {
          return withApiHandler(() => Promise.reject("标签名称不能为空"));
        }
        const res = await prisma.tag.update({
          where: {
            id: body.body.id,
          },
          data: {
            tagName: body.body.tagName,
          },
        });

        return withApiHandler(() => Promise.resolve(), "更新标签成功");
      } catch (error) {
        return withApiHandler(() => Promise.reject(error));
      }
    }

    default:
      return withApiHandler(() => Promise.reject(), "Not Font 404");
  }
};
