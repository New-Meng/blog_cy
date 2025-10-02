import Image from "next/image";

const CommonTitleBar = () => {
  const imageWidth = 25;
  const imageHeight = 25;
  return (
    <div className="w-full mobile:pt-3 pc:p-[20px] pc:flex pc:items-center pc:justify-between">
      <div className="">
        <div className="w-full flex justify-center items-center text-2xl font-bold leading-10 text-white">
          不语的抱枕
        </div>
        <div className="w-full flex justify-center items-center text-sm leading-6 text-white">
          Fly me to the moon
        </div>
      </div>

      <div className="mobile:w-full h-12 flex justify-center items-center gap-5 text-white">
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
        <div className="p-1 rounded-full bg-white">
          <Image
            width={imageWidth}
            height={imageHeight}
            alt="setting"
            src="/setting_icon.png"
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default CommonTitleBar;
