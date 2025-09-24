"use client";

import { ApiResponse } from './response';

interface ApiFetchOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// 构建URL查询参数
const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// 客户端专用的 fetch 函数，包含 alert 通知
export const apiFetch = async <T = any>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T> | undefined> => {
  try {
    const { method = "GET", body, headers, params } = options;

    // 构建完整的URL（包含查询参数）
    let fullUrl = url;
    if (params && Object.keys(params).length > 0) {
      fullUrl += buildQueryString(params);
    }

    // 获取token（如果存在）
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Create an AbortController instance
    const controller = new AbortController();
    const timeout = 360000; // 3 minutes in milliseconds

    // Set timeout to abort the request after 3 minutes
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    const response = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(headers || {})
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal // Attach the abort signal
    });

    // Clear the timeout if the request completes successfully
    clearTimeout(timeoutId);

    const data = await response.json();

    // 检查响应状态
    if (!response.ok) {
      console.error("API请求错误:", fullUrl, response.status, data);

      // 如果后端返回了错误信息，使用后端的错误信息
      // if (data && data.message) {
      //   alert(`请求失败: ${data.message}`);
      // } else {
      //   alert(`请求失败: HTTP ${response.status}`);
      // }
      alert(`请求失败`);

      return undefined;
    }

    return data;
  } catch (error) {
    // Handle network or unknown errors, including timeout
    if (error instanceof Error) {
      // if (error.name === "AbortError") {
      //   alert("请求超时：请检查网络后重试");
      // } else if (!error.message.includes("请求失败")) {
      //   alert("网络错误：网络连接异常，请检查网络后重试");
      // }
      console.error("请求异常:", error);
    }
    return undefined;
  }
};