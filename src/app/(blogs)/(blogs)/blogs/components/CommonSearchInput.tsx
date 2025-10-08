"use client";

import { useState } from "react";

import { SearchOutlined } from "@ant-design/icons";

type OptionsType = {
  defaultColor?: string;
  activeColor?: string;
  showdowOptions?: boxShadowType;
};

type boxShadowType = {
  isDefaulShow?: boolean;
  customCss?: string;
  color?: string; // 阴影颜色
  fuzzy?: number; // 模糊范围
};

type InputParamsType = {
  onChange?: (val: any) => void;
  value?: string;
  height?: number;
  width?: number;
  radis?: string;
  bg?: string;
  placeholder?: string;
  options?: OptionsType;
};

const defaultOptions = {
  defaultColor: "#808080",
  activeColor: "#ffffff",
  showdowOptions: {
    isDefaulShow: true,
    color: "#bbb",
    fuzzy: 2,
  },
};

const MobileSearchInput = ({
  onChange,
  value,
  height = 30,
  width,
  bg = "white",
  placeholder,
  radis = "5px",
  options = defaultOptions,
}: InputParamsType) => {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className="w-full flex items-center justify-center overflow-hidden px-2 text-sm"
      style={{
        width: width,
        height: height + "px",
        background: bg,
        border: `1px solid ${focus ? options?.activeColor : options?.defaultColor}`,
        borderRadius: radis,
        boxShadow: options.showdowOptions?.isDefaulShow
          ? `${options.showdowOptions?.color || "#bbb"} 0px 0px ${options.showdowOptions?.fuzzy || "8px"
          } 0px`
          : "",
      }}
    >
      <input
        placeholder={placeholder}
        defaultValue={value}
        onChange={(val) => {
          const value = val.target.value;
          onChange?.(value);
        }}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
        style={{
          border: "none",
          outline: "none",
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
      />
      <div className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
        <SearchOutlined style={{ color: "#91C8E9", fontWeight: 700 }} />
      </div>

    </div>
  );
};

export default MobileSearchInput;
