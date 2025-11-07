import { RequestOptions, MethodStr, ResponseResBaseType } from "./types";
export class fetchApi {
  private baseUrl = "";
  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || "") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: MethodStr,
    path: string,
    options: RequestOptions
  ): Promise<ResponseResBaseType<T>> {
    try {
      const { body, params, headers = {}, ...rest } = options;

      // 模拟token登录
      // headers.Authorization = "";  1107 改成cookie验证
      if (options.token) {
        const token = localStorage.getItem("token");
        headers.Authorization = token || "";
      }

      const url = new URL(`${this.baseUrl}${path}`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      // 表单上传，做特殊处理
      const isFormData = body instanceof FormData;
      const requestHeaders = {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...headers,
      };

      const response = await fetch(url.toString(), {
        method: method,
        headers: requestHeaders,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        ...rest,
      });
      console.log(response, "++??kkresponse");
      // 如果被告知重定向，则重定向到新的URL
      if (response.redirected) {
        window.location.href = response.url;
        throw new Error("302重定向");
      }
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.log(
          error.message || `Request failed with status ${response.status}`
        );

        throw new Error(
          error.message || `Request failed with status ${response.status}`
        );
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  get<T>(
    path: string,
    options: Omit<RequestOptions, "body"> = {}
  ): Promise<ResponseResBaseType<T>> {
    return this.request<T>("GET", path, options);
  }
  post<T>(
    path: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<ResponseResBaseType<T>> {
    return this.request<T>("POST", path, { ...options, ...body });
  }

  put<T>(
    path: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<ResponseResBaseType<T>> {
    return this.request<T>("PUT", path, { ...options, ...body });
  }

  patch<T>(
    path: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<ResponseResBaseType<T>> {
    return this.request<T>("PATCH", path, { ...options, ...body });
  }

  delete<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<ResponseResBaseType<T>> {
    return this.request<T>("DELETE", path, options);
  }
}

export const _$fetch = new fetchApi();
