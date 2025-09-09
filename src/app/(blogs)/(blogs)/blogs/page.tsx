import React from "react";

const BlogsPage = () => {
  const testList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="w-full h-full">
      {testList.map((item, index) => {
        return (
          <div key={index} className="w-full h-[200px] mb-10">
            {item}
          </div>
        );
      })}
    </div>
  );
};

export default BlogsPage;
