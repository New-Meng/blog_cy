"use client";
import React, { useEffect, useState } from "react";
import { Avatar, message } from "antd";
import dayjs from "dayjs";
import { _$fetch } from "@/app/lib/client/fetch";
import { useCommentContext } from "@/app/(blogs)/(blogs)/(posts)/post-view/CommentProvider";

export interface CommentItem {
  id: string;
  postId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  // 可能是匿名用户
  visitorName?: string;
  visitorEmail?: string;
  content: string;
  createdAt: string; // ISO 字符串
  parentName?: string;
  parentId?: string; // 父评论ID，用于回复
  rootId?: string; // 根评论ID，用于回复线程
  applyUserId?: number;
  tempApplyUserName?: string;
  applyUser?: {
    id: number;
    username: string;
    avatar?: string;
  };

  isUnLike?: boolean; // 是否点踩了
  isLike?: boolean; // 是否点赞了

  children?: CommentItem[];
}

const getList = async (postId: number) => {
  let list;
  try {
    const comments = await _$fetch.get<any>("apiv1/comment/get", {
      params: {
        postId: postId,
      },
    });
    list = comments.data;
  } catch (error) {
    list = [];
  }
  return list;
};

const CommentItem: React.FC<{
  item: CommentItem;
  postId: number;
  onUpdateItem: (childrenIndex: number, operate: 1 | 2) => void;
}> = ({ item, postId, onUpdateItem }) => {
  const { parentInfo, setParentInfo } = useCommentContext() || {};
  const [messageApi, contextHolder] = message.useMessage();
  console.log(item, "++??item");

  const handleOperateLike = async (item: CommentItem, index: number) => {
    try {
      if (item.isLike) {
        const res = await _$fetch.post<any>("apiv1/comment/cancelLike", {
          body: {
            commentId: item.id,
            postId: postId,
          },
        });
        if (res.success) {
          messageApi.success(res.message || "操作成功");
          onUpdateItem(index, 1);
        } else {
          messageApi.error(res.message || "操作失败");
        }
      } else {
        const res = await _$fetch.post<any>("apiv1/comment/like", {
          body: {
            commentId: item.id,
            postId: postId,
          },
        });
        if (res.success) {
          messageApi.success(res.message || "操作成功");
          onUpdateItem(index, 1);
        } else {
          messageApi.error(res.message || "操作失败");
        }
      }

      console.log(item, "++??item");
    } catch (error) {
      console.log(error);
    }
  };

  const handleOperateUnlike = async (item: CommentItem, index: number) => {
    try {
      if (item.isUnLike) {
        const res = await _$fetch.post<any>("apiv1/comment/cancelUnlike", {
          body: {
            commentId: item.id,
            postId: postId,
          },
        });
        if (res.success) {
          messageApi.success(res.message || "操作成功");
          onUpdateItem(index, 2);
        } else {
          messageApi.error(res.message || "操作失败");
        }
      } else {
        const res = await _$fetch.post<any>("apiv1/comment/unlike", {
          body: {
            commentId: item.id,
            postId: postId,
          },
        });
        if (res.success) {
          messageApi.success(res.message || "操作成功");
          onUpdateItem(index, 2);
        } else {
          messageApi.error(res.message || "操作失败");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return item?.children && item.children.length > 0 ? (
    <>
      {contextHolder}
      <div className="flex space-x-3 py-3 border-b border-gray-100 last:border-0">
        {/* 头像 */}
        <Avatar
          src={item?.user?.avatar}
          alt={item?.visitorName || item?.user?.username || "匿名用户"}
          size={40}
          onClick={() => {
            console.log(item);
          }}
        />

        <div className="flex-1 ml-3">
          {/* 用户名 & 时间 */}
          <div className="flex justify-between items-center pr-2">
            <div className="flex items-center space-x-4 text-sm relative">
              <span className="font-semibold  text-gray-900">
                {item?.visitorName || item?.user?.username || "匿名用户"}
              </span>
            </div>
            <div
              className="flex items-center space-x-2 text-sm text-gray-500 cursor-pointer"
              onClick={() => {
                setParentInfo?.(() => {
                  return item;
                });
              }}
            >
              <span className="font-semibold">回复</span>
            </div>
          </div>

          {/* 评论内容 */}
          <p className="mt-1 text-gray-800 break-words">{item.content}</p>
          <div className="w-full flex justify-center items-center mt-2">
            <div className="flex-1 flex items-center">
              <div
                className="flex items-center space-x-1 text-gray-500 text-sm cursor-pointer"
                onClick={() => handleOperateLike(item, -1)}
              >
                {item.isLike ? (
                  <img src="/like1-active.png" alt="like" className="h-4 w-4" />
                ) : (
                  <img src="/like1.png" alt="like" className="h-4 w-4" />
                )}

                <span>赞</span>
              </div>
              <div
                className="ml-4 flex items-center space-x-1 text-gray-500 text-sm cursor-pointer"
                onClick={() => {
                  handleOperateUnlike(item, -1);
                }}
              >
                {item?.isUnLike ? (
                  <img
                    src="/unlike-active.png"
                    alt="dislike"
                    className="h-4 w-4"
                  />
                ) : (
                  <img src="/unlike.png" alt="dislike" className="h-4 w-4" />
                )}
                <span>踩</span>
              </div>
            </div>

            <div className="text-gray-500 space-x-2">
              {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            </div>
          </div>
        </div>
      </div>
      {item.children.map((cItem, childIndex) => {
        return (
          <div className="flex space-x-3 pl-5 py-3 border-b border-gray-100 last:border-0">
            {/* 头像 */}
            <Avatar
              src={cItem?.user?.avatar}
              alt={cItem?.visitorName || cItem?.user?.username || "匿名用户"}
              size={40}
              onClick={() => {
                console.log(cItem);
              }}
            />

            <div className="flex-1 ml-3">
              {/* 用户名 & 时间 */}
              <div className="flex justify-between items-center pr-2">
                <div className="flex items-center space-x-4 text-sm relative">
                  <span className="font-semibold  text-gray-900">
                    {cItem?.visitorName || cItem?.user?.username || "匿名用户"}
                    {cItem.applyUserId
                      ? ` > ${cItem?.applyUser?.username}`
                      : cItem.tempApplyUserName
                      ? ` > ${cItem.tempApplyUserName}`
                      : ""}
                  </span>
                </div>
                <div
                  className="flex items-center space-x-2 text-sm text-gray-500 cursor-pointer"
                  onClick={() => {
                    setParentInfo?.(() => {
                      return cItem;
                    });
                  }}
                >
                  <span className="font-semibold">回复</span>
                </div>
              </div>

              {/* 评论内容 */}
              <p className="mt-1 text-gray-800 break-words">{cItem.content}</p>

              <div className="w-full flex justify-center items-center mt-2">
                <div className="flex-1 flex items-center">
                  <div
                    className="flex items-center space-x-1 text-gray-500 text-sm cursor-pointer"
                    onClick={() => handleOperateLike(cItem, childIndex)}
                  >
                    {cItem.isLike ? (
                      <img
                        src="/like1-active.png"
                        alt="like"
                        className="h-4 w-4"
                      />
                    ) : (
                      <img src="/like1.png" alt="like" className="h-4 w-4" />
                    )}

                    <span>赞</span>
                  </div>
                  <div
                    className="ml-4 flex items-center space-x-1 text-gray-500 text-sm cursor-pointer"
                    onClick={() => {
                      handleOperateUnlike(cItem, childIndex);
                    }}
                  >
                    {cItem?.isUnLike ? (
                      <img
                        src="/unlike-active.png"
                        alt="dislike"
                        className="h-4 w-4"
                      />
                    ) : (
                      <img
                        src="/unlike.png"
                        alt="dislike"
                        className="h-4 w-4"
                      />
                    )}
                    <span>踩</span>
                  </div>
                </div>

                <div className="text-gray-500 space-x-2">
                  {dayjs(cItem.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  ) : (
    <div className="flex space-x-3 py-3 border-b border-gray-100 last:border-0">
      {/* 头像 */}
      <Avatar
        src={item?.user?.avatar}
        alt={item?.visitorName || item?.user?.username || "匿名用户"}
        size={40}
        onClick={() => {
          console.log(item);
        }}
      />

      <div className="flex-1 ml-3">
        {/* 用户名 & 时间 */}
        <div className="flex justify-between items-center pr-2">
          <div className="flex items-center space-x-4 text-sm relative">
            <span className="font-semibold  text-gray-900">
              {item?.visitorName || item?.user?.username || "匿名用户"}
            </span>
          </div>
          <div
            className="flex items-center space-x-2 text-sm text-gray-500 cursor-pointer"
            onClick={() => {
              setParentInfo?.(() => {
                return item;
              });
            }}
          >
            <span className="font-semibold">回复</span>
          </div>
        </div>

        {/* 评论内容 */}
        <p className="mt-1 text-gray-800 break-words">{item.content}</p>

        <div className="w-full flex flex-between items-center mt-2">
          <div className="flex-1 flex items-center">
            <div
              className="flex items-center space-x-1 text-gray-500 text-sm cursor-pointer"
              onClick={() => handleOperateLike(item, -1)}
            >
              {item.isLike ? (
                <img src="/like1-active.png" alt="like" className="h-4 w-4" />
              ) : (
                <img src="/like1.png" alt="like" className="h-4 w-4" />
              )}

              <span>赞</span>
            </div>
            <div
              className="ml-4 flex items-center space-x-1 text-gray-500 text-sm cursor-pointer"
              onClick={() => {
                handleOperateUnlike(item, -1);
              }}
            >
              {item?.isUnLike ? (
                <img
                  src="/unlike-active.png"
                  alt="dislike"
                  className="h-4 w-4"
                />
              ) : (
                <img src="/unlike.png" alt="dislike" className="h-4 w-4" />
              )}
              <span>踩</span>
            </div>
          </div>

          <div className="text-gray-500 space-x-2">
            {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentListWidget = ({ postId }: { postId: number }) => {
  const [list, setList] = useState<CommentItem[]>([]);
  const [selectedReply, setSelectedReply] = useState<CommentItem | null>(null);
  useEffect(() => {
    getList(postId).then((res) => setList(res));
  }, [postId]);

  if (!list.length) {
    return (
      <div className="w-full p-2">
        <div className="flex justify-center items-center bg-white min-h-[100px] rounded-sm text-gray-500 text-sm">
          该文章暂无评论
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="p-2 bg-white rounded-lg shadow-sm divide-y divide-gray-100">
        {list?.map((c: any, index: number) => (
          <CommentItem
            onUpdateItem={(childIndex: number, operate) => {
              console.log(childIndex, "++??index");
              const tempList = JSON.parse(JSON.stringify(list));
              if (childIndex == -1) {
                if (operate == 1) {
                  tempList[index].isLike = !tempList[index].isLike;
                } else {
                  tempList[index].isUnLike = !tempList[index].isUnLike;
                }
              } else {
                if (operate == 1) {
                  tempList[index].children[childIndex].isLike =
                    !tempList[index].children[childIndex].isLike;
                } else {
                  tempList[index].children[childIndex].isUnLike =
                    !tempList[index].children[childIndex].isUnLike;
                }
              }
              setList(tempList);
            }}
            postId={postId}
            key={c.id}
            item={c}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentListWidget;
