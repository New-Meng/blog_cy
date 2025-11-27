"use client";
import { _$fetch } from "@/app/lib/client/fetch";
import { useEffect, useState } from "react";
import { message } from "antd";
import { CustomPost } from "../page";

const PostOperate = ({
  postId,
  item,
}: {
  postId: number;
  item: CustomPost;
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        const res = await _$fetch.post(`/apiv1/blogs/unfavorite`, {
          body: {
            postId,
          },
        });
        if (res.success) {
          setIsFavorite(!isFavorite);
          setFavoriteCount((pre) => {
            if (pre > 0) {
              return pre - 1;
            } else {
              return 0;
            }
          });
        } else {
          messageApi.error(res.message || "取消收藏失败");
        }
      } else {
        const res = await _$fetch.post(`/apiv1/blogs/favorite`, {
          body: {
            postId,
          },
        });
        if (res.success) {
          setIsFavorite(!isFavorite);
          setFavoriteCount((pre) => {
            if (pre > 0) {
              return pre + 1;
            } else {
              return 1;
            }
          });
        } else {
          messageApi.error(res.message || "收藏失败");
        }
      }
    } catch (error) {
      messageApi.error("操作失败");
    }
  };

  const handleShareLike = () => {
    navigator.clipboard.writeText(window.location.href);
    messageApi.success("分享链接复制成功!");
  };

  useEffect(() => {
    setIsFavorite(item?.isFavorited);
    // if (item?.isFavorited)
    setFavoriteCount(item?.favoriteCount || 0);
  }, [item?.isFavorited]);

  return (
    <>
      {contextHolder}
      <div className="w-full pt-2 box-border bg-white">
        <div className="flex h-[30px] justify-end items-center px-2 w-full box-border">
          {/* 喜欢 or 取消喜欢 */}
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={handleFavoriteClick}
          >
            {isFavorite ? (
              <img
                className="w-[25px] h-[25px] object-cover"
                src="/favorite-active.png"
                alt=""
              />
            ) : (
              <img
                className="w-[25px] h-[25px] object-cover"
                src="/favorite-default.png"
                alt=""
              />
            )}
            <div className="ml-2 text-[14px] font-bold text-[#333333]">
              {isFavorite ? "已喜欢" : "喜欢"}
              {favoriteCount > 0 ? `(${favoriteCount})` : ""}
            </div>
          </div>

          {/* 分享，复制链接 */}
          <div
            className="ml-4 flex items-center justify-center cursor-pointer"
            onClick={handleShareLike}
          >
            <img
              className="w-[25px] h-[25px] object-cover"
              src="/share.png"
              alt=""
            />
            <div className="ml-2 text-[14px] font-bold text-[#333333]">
              分享
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostOperate;
