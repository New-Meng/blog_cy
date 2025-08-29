import ClientFormComponent from "./ClientComponents/ClientForm";
import Image from "next/image";

// 设置next 缓存
export const revalidate = 100;

interface CatImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
}

const signUpPage = async () => {
  let src: string = "";
  try {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const data: CatImage[] = await response.json();
    src = data[0]?.url;
    console.log(src, "++??kkzheloi");
  } catch (error) {
    console.log(error, "++??error");
  }

  return (
    <div className="relative w-[100vw] h-[100vh]">
      <div className="absolute top-[100px] left-[50%] translate-x-[-50%] w-[400px] h-[300px] border-1 border-solid border-[#cfcfcf]">
        {/* 服务端页面，使用客户端组件 */}
        <div>
          <Image
            width={50}
            height={50}
            alt="随机的图片"
            src={src}
          ></Image>
        </div>
        <div className="p-5">
          <ClientFormComponent></ClientFormComponent>
        </div>
      </div>
    </div>
  );
};

export default signUpPage;
