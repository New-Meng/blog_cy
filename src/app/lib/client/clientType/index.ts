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

export const extractFirstTwoParagraphs = (
  mdxContent: string,
  replaceStr: string
) => {
  // 方法1: 简单按换行分割（适用于标准段落）
  const paragraphs = mdxContent.split(replaceStr);
  let strIndex = 0;
  const firstTwo = paragraphs.reduce((pre, next) => {
    let nextStr = next ? next : replaceStr;
    if (next) {
      strIndex += 1;
    }
    if (strIndex < 2 || strIndex == 2) {
      return (pre += nextStr);
    } else {
      return pre;
    }
  }, "");
  return firstTwo;
};
