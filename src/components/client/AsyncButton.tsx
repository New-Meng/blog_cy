"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const Button = dynamic(() =>
  import("antd/es/button").then((mod) => {
    return mod;
  })
);

type InParament = {
  children: React.ReactNode;
  onClick: () => void;
  [key: string]: unknown;
};

export const AsyncButton = ({ children, onClick, ...arg }: InParament) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onClick();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <Button {...arg} onClick={handleClick} loading={loading}>
      <div>{children}</div>
    </Button>
  );
};
