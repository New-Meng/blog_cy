"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const Button = dynamic(() =>
  import("antd/es/button").then((mod) => {
    return mod;
  })
);

const isAsyncFunction = (fun: () => any) => {
  if (!fun) {
    return false;
  }
  if (fun.constructor.name === "AsyncFunction") {
    return true;
  }
};

type InParament = {
  children: React.ReactNode;
  onClick: () => any;
  [key: string]: unknown;
};

export const AsyncButton = ({ children, onClick, ...arg }: InParament) => {
  const [loading, setLoading] = useState(false);
  let isAsync = isAsyncFunction(onClick);
  const handleClick = async () => {
    if (loading) return;
    if (isAsync) {
      setLoading(true);
      try {
        await onClick();
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    } else {
      onClick();
    }
  };
  return (
    <Button {...arg} onClick={handleClick} loading={loading}>
      <div className={`${arg?.className}`}>{children}</div>
    </Button>
  );
};
