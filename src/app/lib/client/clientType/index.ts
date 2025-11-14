export const getClientType = (): "pc" | "mobile" | Error => {
  // 纯客户端调用
  if (window) {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return "mobile";
    } else {
      return "pc";
    }
  } else {
    throw new Error("只允许客户端组件调用");
  }
};

export const extractFirstTwoParagraphs = (mdxContent: string) => {
  // 方法1: 简单按换行分割（适用于标准段落）
  const paragraphs = mdxContent.split("\n\n");
  const firstTwo = paragraphs.slice(0, 2);
  return firstTwo.join("\n\n");
};
