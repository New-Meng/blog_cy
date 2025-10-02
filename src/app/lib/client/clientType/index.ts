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
