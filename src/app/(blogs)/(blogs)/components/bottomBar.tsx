import React from "react";

export default function BottomBar() {
  return (
    <footer className="w-full h-[80px] bg-gray-100 py-4 border-t text-center text-sm text-gray-600">
      <div>© {new Date().getFullYear()} 已备案</div>
      <div>底部联系方式</div>
    </footer>
  );
}
