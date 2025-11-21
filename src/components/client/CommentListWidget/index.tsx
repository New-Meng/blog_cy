"use client";
import React, { useEffect, useState } from "react";
import { Avatar } from "antd";
import dayjs from "dayjs";
import { _$fetch } from "@/app/lib/client/fetch";
import { useCommentContext } from "@/app/(blogs)/(blogs)/(posts)/post-view/CommentProvider";

export interface CommentItem {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string; // ISO 字符串
  replies?: CommentItem[];
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
  depth: number;
  setSelectedReply?: (item: CommentItem) => void;
}> = ({ item, depth, setSelectedReply }) => {
  const { setParentId, setParentName } = useCommentContext() || {};

  return (
    <div className="flex space-x-3 py-3 border-b border-gray-100 last:border-0">
      {/* 头像 */}
      <Avatar src={item.user.avatar} alt={item.user.username} size={40} />

      <div className="flex-1 ml-3">
        {/* 用户名 & 时间 */}
        <div className="flex justify-between items-center pr-2">
          <div className="flex items-center space-x-4 text-sm relative">
            <span className="font-semibold  text-gray-900">
              {item.user.username}
            </span>
            <span className="text-gray-500 space-x-2">
              {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          </div>
          <div
            className="flex items-center space-x-2 text-sm text-gray-500 cursor-pointer"
            onClick={() => {
              setParentId?.(item.id);
              setParentName?.(item.user.username);
            }}
          >
            <span className="font-semibold">回复</span>
          </div>
        </div>

        {/* 评论内容 */}
        <p className="mt-1 text-gray-800 break-words">{item.content}</p>
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
        {list?.map((c: any) => (
          <CommentItem
            setSelectedReply={setSelectedReply}
            key={c.id}
            item={c}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentListWidget;
