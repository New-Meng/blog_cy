import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { MENU_LIST1, MENU_LIST2 } from "@/app/lib/constant";

const initTagDataBae = async () => {
  console.log("初始化tag表开始");
  const originData = await prisma.tag.findMany();
  let pushData = [...MENU_LIST1, ...MENU_LIST2].map((item) => ({
    tagName: item.name,
  }));
  if (originData && originData.length) {
    const originNameList = originData.map((item) => {
      return item.tagName;
    });
    pushData = pushData.filter((item) => {
      return !originNameList.includes(item.tagName);
    });
    await prisma.tag.createMany({
      data: pushData,
    });
  } else {
    await prisma.tag.createMany({
      data: pushData,
    });
  }

  console.log("初始化tag表完成");
};

async function main() {
  console.log("初始化数据库开始");

  await initTagDataBae();

  console.log("初始化数据库完成");
}

main()
  .catch((e) => {
    console.error(e, "++??初始化执行错误");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
