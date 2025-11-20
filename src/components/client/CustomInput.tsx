"use client";
import Password from "antd/es/input/Password";
import React, { useState } from "react";

type PropsType = {
  type?: string;
  eyes?: boolean;
  label?: string;
  labelSize?: string;
  labelColor?: string;
  holderColor?: string;
  width?: string;
  borderColor?: string;
  activeBorderColor?: string;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  value?: string;
};

const CustomInput: React.FC<PropsType> = ({
  label = "",
  labelSize = "16px",
  labelColor = "black",
  holderColor = "#ffffff",
  width = "",
  borderColor = "#d1d5db",
  activeBorderColor = "#3b82f6",
  placeholder = "",
  className = "",
  eyes = false,
  type = "text",
  onChange,
  value,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange && onChange(newValue);
  };

  const changeEyesMode = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`w-full flex items-center justify-between ${className}`}>
      {label && (
        <div
          style={{ color: labelColor }}
          className={`text-[${labelSize}] text-gray-700 mr-5 flex justify-center items-center`}
        >{`${label}:`}</div>
      )}
      <div
        className="flex-1 flex justify-between items-center px-3 py-2 rounded transition-colors"
        style={{
          width,
          border: `1px solid ${isFocused ? activeBorderColor : borderColor}`,
        }}
      >
        <input
          className={`w-[calc(100%__-__60px)] outline-none bg-transparent`}
          value={value !== undefined ? value : inputValue}
          placeholder={placeholder}
          style={{ "--placeholder-color": holderColor } as React.CSSProperties}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          type={type}
        />

        {eyes ? (
          <div
            className="w-[36px] cursor-pointer text-sm font-medium text-[#d5d5d5] ml-5 flex justify-center items-center"
            onClick={changeEyesMode}
          >
            {showPassword ? "显示" : "隐藏"}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CustomInput;
