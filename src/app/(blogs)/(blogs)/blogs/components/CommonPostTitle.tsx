import dayjs from "dayjs";

type ParamsType = {
  isClick?: boolean;
  tagList?: any[];
  baseInfo: PostBaseInfo;
};

type PostBaseInfo = {
  createdAt: Date | string;
  title: string;
};
const CommonPostTitle = ({ isClick = true, baseInfo, tagList }: ParamsType) => {
  return (
    <>
      <div className="h-full article-title flex items-start justify-between">
        <div className="text-xl font-bold">{baseInfo?.title || ""}</div>
        <div className="flex flex-col justify-center items-start gao-[4px]">
          <div className="">
            {baseInfo.createdAt
              ? dayjs(baseInfo.createdAt).format("MM/DD")
              : ""}
          </div>
          <div>
            {baseInfo.createdAt ? dayjs(baseInfo.createdAt).format("YYYY") : ""}
          </div>
        </div>
      </div>

      <div className="m-2 flex flex-wrap justify-start gap-x-2 pc:gap-x-5 gap-y-2">
        {(tagList || []).map((item, index) => {
          return (
            <div
              className="px-3 py-1 bg-[#EEEEEE] cursor-pointer text-xs"
              key={index}
            >
              {item?.name}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CommonPostTitle;
