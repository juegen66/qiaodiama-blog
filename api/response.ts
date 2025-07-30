// 统一的API响应类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

// 分页响应类型
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// 成功响应构造函数
export const successResponse = <T>(data: T): ApiResponse<T> => {
  return {
    code: 200,
    message: "success",
    data: data || null
  };
};

// 错误响应构造函数
export const errorResponse = (message: string, code: number = 400): ApiResponse<null> => {
  return {
    code,
    message,
    data: null
  };
};
  