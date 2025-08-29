import React from "react";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-[1200px] min-h-[calc(100vh__-__145px)] mx-auto my-0 flex justify-center items-start p-5">
      {children}
    </main>
  );
}
