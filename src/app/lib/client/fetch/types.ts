export type RequestOptions = {
  method?: MethodStr;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
  signal?: AbortSignal;
  catch?: boolean; // 是否缓存
  token?: boolean; // 是否携带token
};

export type MethodStr = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ResponseResBaseType<T> = {
  code: number;
  message: string;
  success: boolean;
  data: T;
};

// list分页数据
export type ResponseListType<T> = {
  total: number;
  pageSize: number;
  pageNum: number;
  list: T;
};
