module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    screens: {
      mobile: { max: "767px" }, // 移动端（≤767px）
      pc: { min: "768px" }, // PC端（≥768px）
    },
    extend: {
      colors: {
        // light 就是普通的颜色
        light: {
          text: "#ff587cff",
          bg: "pink",
        },
        dark: {},
      },
    },
  },
  plugins: [],
};
