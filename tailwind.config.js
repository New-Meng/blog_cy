module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      mobile: { max: "767px" }, // 移动端（≤767px）
      pc: { min: "768px" }, // PC端（≥768px）
    },
  },
  plugins: [],
};
