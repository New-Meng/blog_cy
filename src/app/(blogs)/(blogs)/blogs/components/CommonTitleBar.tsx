"use client";
import Image from "next/image";
import MobileSearchInput from "./CommonSearchInput";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CommonTitleBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const imageWidth = 25;
  const imageHeight = 25;

  const [title, setTitle] = useState("");

  const changeTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("title", val);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const titleStr = params.get("title");
    setTitle(titleStr || "");
  }, []);

  return (
    <>
      <div className="w-full mobile:pt-3 pc:flex pc:items-center pc:justify-between">
        <div className="">
          <div className="w-full flex justify-center items-center text-2xl font-bold leading-10 text-white">
            不语的抱枕
          </div>
          <div className="w-full flex justify-center items-center text-sm leading-6 text-white">
            Fly me to the moon
          </div>
        </div>

        <div className="mobile:w-full h-12 flex justify-center items-center gap-5 text-white">
          <div className="mobile:hidden text-black">
            <MobileSearchInput
              width={200}
              height={30}
              placeholder="搜索"
              value={title}
              onSearch={handleSearch}
            ></MobileSearchInput>
          </div>
          <div className="p-1 rounded-full bg-white">
            <Image
              width={imageWidth}
              height={imageHeight}
              alt="github"
              src="/github_icon.png"
            ></Image>
          </div>
          <div className="p-1 rounded-full bg-white">
            <Image
              width={imageWidth}
              height={imageHeight}
              alt="background"
              src="/image_icon.png"
            ></Image>
          </div>
          <div
            className="p-1 rounded-full bg-white"
            onClick={() => {
              changeTheme();
            }}
          >
            <Image
              width={imageWidth}
              height={imageHeight}
              alt="setting"
              src="/setting_icon.png"
            ></Image>
          </div>

          <Link href="/createpost" className="p-1 rounded-full bg-white">
            <Image
              width={imageWidth}
              height={imageHeight}
              alt="release"
              src="/release.png"
            ></Image>
          </Link>
        </div>
      </div>
      <div className="w-full flex justify-center items-center box-border p-2 pc:hidden">
        <MobileSearchInput
          width={200}
          height={30}
          placeholder="搜索"
          value={title}
          onSearch={handleSearch}
        ></MobileSearchInput>
      </div>
    </>
  );
};

export default CommonTitleBar;
