import { PrismaClient } from "@prisma/client";
import { MENU_LIST1, MENU_LIST2 } from "../../src/app/lib/constant";

const prisma = new PrismaClient();

// 初始化tag 表数据
const initDataBase = async () => {
  // 创建指定的tag
  const tagNames = MENU_LIST1.concat(MENU_LIST2).map((tag) => {
    return {
      tagName: tag.name,
    };
  });
  const tagInit = await prisma.tag.createMany({
    data: tagNames,
  });

  if (tagInit.count == tagNames.length) {
    console.log("tag init success");
    const baseTagList = await prisma.tag.findMany();
    console.log(baseTagList)
  } else {
    throw new Error("初始化tag表失败，数量不一致");
  }
};
