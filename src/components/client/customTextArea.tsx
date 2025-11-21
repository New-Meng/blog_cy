import React from "react";

type CustomTextAreaProspType = {
  value?: string;
  borderColor: string;
  placeholder: string;
  rows?: number;
  height?: number;
  onChange?: (value: string) => void;
};

const CustomTextArea = ({
  value,
  onChange,
  borderColor,
  placeholder,
  rows = 4,
  height = 100,
}: CustomTextAreaProspType) => {
  return (
    <div className="px-3 bg-white rounded-sm">
      <textarea
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        className={`w-full h-[${height}px] p-2 border border-solid border-[${borderColor}] rounded-sm focus:outline-none`}
        placeholder={placeholder}
        rows={rows}
      ></textarea>
    </div>
  );
};

export default CustomTextArea;
