export const HOME_PAGE = "/blogs";

export const MENU_LIST1 = [
  {
    name: "ACG",
    // 将原来的 tag=32 提取为对象 id，href 只保留路径，避免 Link 对 pathname 编码导致 %3F
    href: HOME_PAGE,
    id: 32,
    noPrefetch: false,
  },
  {
    name: "学习",
    href: HOME_PAGE,
    id: 33,
  },
  {
    name: "软件",
    href: HOME_PAGE,
    id: 34,
  },
  {
    name: "游戏",
    href: HOME_PAGE,
    id: 35,
  },
  {
    name: "其他",
    href: HOME_PAGE,
    id: 36,
  },
];

export const MENU_LIST2 = [
  {
    name: "RSS",
    href: HOME_PAGE,
    id: 37,
  },
  {
    name: "Pixiv",
    href: HOME_PAGE,
    id: 38,
  },
  {
    name: "AI女友",
    href: HOME_PAGE,
    id: 39,
  },
  {
    name: "魔法喵",
    href: HOME_PAGE,
    id: 40,
  },
  {
    name: "关于",
    href: "/about",
  },
  {
    name: "登录",
    href: "/login",
  },
  {
    name: "超级头脑",
    href: "/admin",
    noPrefetch: true,
  },
];

export const GITHUB_URL = "https://github.com/New-Meng";
