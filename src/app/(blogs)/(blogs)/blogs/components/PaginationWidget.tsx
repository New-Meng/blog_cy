import { forwardRef, useImperativeHandle, useRef } from "react";
import { Pagination } from "antd";

const PaginationWidget = forwardRef((props, ref) => {
  const paginationRef = useRef<any>();

  useImperativeHandle(ref, () => {
    return {
      // 暴露 pagination 的所有方法
      ...paginationRef.current,
    };
  });

  return <Pagination {...props} ref={paginationRef}></Pagination>;
});

export default PaginationWidget;
