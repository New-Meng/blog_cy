"use client";
import { ReactNode, useContext, useState, createContext } from "react";

interface ContextType {
  parentId: string;
  setParentId: (parentId: string) => void;
  parentName: string;
  setParentName: (parentName: string) => void;
}
const CommentContext = createContext<ContextType | undefined>(undefined);
export function CommentProvider({ children }: { children: ReactNode }) {
  // 使用 useState、useEffect 等客户端特性
  const [parentId, setParentId] = useState("");
  const [parentName, setParentName] = useState("");

  const value = {
    parentId,
    setParentId,
    parentName,
    setParentName,
  };

  return (
    <CommentContext.Provider value={value}>
      {children} {/* ← 这里的 children 保持原有性质 */}
    </CommentContext.Provider>
  );
}

export const useCommentContext = () => useContext(CommentContext);
