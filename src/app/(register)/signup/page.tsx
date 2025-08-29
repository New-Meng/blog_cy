import ClientFormComponent from "./ClientComponents/ClientForm";

const signUpPage = async () => {
  return (
    <div className="relative w-[100vw] h-[100vh]">
      <div className="absolute top-[100px] left-[50%] translate-x-[-50%] w-[400px] h-[300px] border-1 border-solid border-[#cfcfcf]">
        {/* 服务端页面，使用客户端组件 */}
        <div></div>
        <div className="p-5">
          <ClientFormComponent></ClientFormComponent>
        </div>
      </div>
    </div>
  );
};

export default signUpPage;
