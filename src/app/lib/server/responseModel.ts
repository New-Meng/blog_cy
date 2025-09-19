export const paginationListResponse = async (
  pageSize: number,
  pageNum: number,
  totalPosts: number,
  list: any[]
) => {
  const responseData = {
    list: list,
    pageSize: pageSize,
    pageNum: pageNum,
    total: totalPosts,
  };
  return responseData;
};
