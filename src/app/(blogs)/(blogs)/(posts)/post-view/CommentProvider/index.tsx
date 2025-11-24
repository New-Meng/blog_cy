"use client";
import { ReactNode, useContext, useState, createContext } from "react";

interface InfoType {
  id: string;
  postId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string; // ISO 字符串
  parentName?: string;
  parentId?: string; // 父评论ID，用于回复
  rootId?: string; // 根评论ID，用于回复线程
  visitorName?: string; // 临时的
  visitorEmail?: string;
}

interface ContextType {
  parentInfo: InfoType | null;
  setParentInfo: React.Dispatch<React.SetStateAction<InfoType | null>>;
}
const CommentContext = createContext<ContextType | undefined>(undefined);
export function CommentProvider({ children }: { children: ReactNode }) {
  // 使用 useState、useEffect 等客户端特性
  const [parentInfo, setParentInfo] = useState<InfoType | null>(null);

  const refreshData = () => {}

  const value = {
    parentInfo,
    setParentInfo,
  };

  return (
    <CommentContext.Provider value={value}>
      {children} {/* ← 这里的 children 保持原有性质 */}
    </CommentContext.Provider>
  );
}

export const useCommentContext = () => useContext(CommentContext);
