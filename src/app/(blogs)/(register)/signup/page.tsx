import ClientFormComponent from "./ClientComponents/ClientForm";

const signUpPage = async () => {
  return (
    <div className="relative w-[100vw] h-[100vh] default-bg dark:default-bg-dark mobile:pt-[100px]">
      <div
        style={{
          boxShadow:
            "0 0 8px 2px #91C8E9, 0 0 3px 1px rgba(255, 255, 255, 0.8)",
        }}
        className="pc:absolute pc:top-[calc(50%__-__250px)] pc:left-1/2 mobile:m-auto p-[20px] w-[500px] mobile:w-[calc(100%__-__40px)] mobile:mx-[20px] border-[1px] border-solid border-[#91C8E9] rounded-[10px]"
      >
        {/* 服务端页面，使用客户端组件 */}
        <div className="p-5">
          <ClientFormComponent></ClientFormComponent>
        </div>
      </div>
    </div>
  );
};

export default signUpPage;
