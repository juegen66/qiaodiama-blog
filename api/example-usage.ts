// 使用新的API系统的示例代码
// 这个文件展示了如何使用重构后的API

import { getCategoryList, createCategory, getPostList, getTagSimpleList } from './article';
import { apiFetch } from './fetch';
import { ApiResponse } from './response';

// 示例1: 获取分类列表
export const exampleGetCategories = async () => {
  try {
    const response = await getCategoryList();
    if (response && response.code === 200) {
      console.log('分类列表:', response.data);
      return response.data;
    } else {
      console.error('获取分类失败:', response?.message);
      return null;
    }
  } catch (error) {
    console.error('请求异常:', error);
    return null;
  }
};

// 示例2: 创建新分类
export const exampleCreateCategory = async (name: string, description?: string) => {
  try {
    const response = await createCategory({ name, description });
    if (response && response.code === 200) {
      console.log('创建分类成功:', response.data);
      return response.data;
    } else {
      console.error('创建分类失败:', response?.message);
      return null;
    }
  } catch (error) {
    console.error('请求异常:', error);
    return null;
  }
};

// 示例3: 获取文章列表（带分页和筛选）
export const exampleGetPosts = async (page: number = 1, categoryId?: number) => {
  try {
    const response = await getPostList({
      page,
      page_size: 10,
      category_id: categoryId
    });
    if (response && response.code === 200) {
      console.log('文章列表:', response.data);
      return response.data;
    } else {
      console.error('获取文章失败:', response?.message);
      return null;
    }
  } catch (error) {
    console.error('请求异常:', error);
    return null;
  }
};

// 示例4: 直接使用apiFetch进行自定义请求
export const exampleCustomRequest = async () => {
  try {
    // GET请求示例
    const getResponse = await apiFetch<{ message: string }>('/api/test');
    console.log('GET响应:', getResponse);

    // POST请求示例
    const postResponse = await apiFetch<any>('/api/custom-endpoint', {
      method: 'POST',
      body: {
        key: 'value',
        data: 'example'
      }
    });
    console.log('POST响应:', postResponse);

    // 带查询参数的GET请求
    const queryResponse = await apiFetch<any>('/api/search', {
      params: {
        q: 'search term',
        page: 1,
        limit: 10
      }
    });
    console.log('查询响应:', queryResponse);

  } catch (error) {
    console.error('自定义请求异常:', error);
  }
};

// 示例5: 错误处理最佳实践
export const exampleErrorHandling = async () => {
  try {
    const response = await getCategoryList();
    
    // 检查响应是否存在
    if (!response) {
      console.error('请求失败：无响应数据');
      return;
    }

    // 检查响应状态码
    if (response.code !== 200) {
      console.error('请求失败：', response.message);
      return;
    }

    // 检查数据是否存在
    if (!response.data) {
      console.warn('请求成功但无数据');
      return;
    }

    // 处理成功响应
    console.log('请求成功:', response.data);
    return response.data;

  } catch (error) {
    console.error('请求异常:', error);
    // 这里可以添加错误上报逻辑
    throw error;
  }
};

// 使用说明：
/*
1. 所有API函数现在返回 Promise<ApiResponse<T> | undefined>
2. 成功响应的格式为: { code: 200, message: "success", data: T }
3. 错误响应的格式为: { code: 错误码, message: "错误信息", data: null }
4. 如果网络错误或其他异常，函数返回 undefined
5. apiFetch 函数自动处理：
   - 查询参数构建
   - 请求头设置（包括Authorization）
   - 超时控制（6分钟）
   - 错误提示（alert）
   - 响应解析
*/
