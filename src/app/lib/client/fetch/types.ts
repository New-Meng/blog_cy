export type RequestOptions = {
  method?: MethodStr;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  signal?: AbortSignal;
  catch?: boolean; // 是否缓存
};

export type MethodStr = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ResponseResBaseType<T> = {
  code: number;
  message: string;
  success: boolean;
  data?: T;
};
