import { apiFetch } from './fetch';
import { ApiResponse, PaginationResponse } from './response';

// 接口返回类型定义

// 分类接口类型
export interface Category {
  id: number;
  name: string;
  description?: string;
  createTime?: string;
  updateTime?: string;
  _count?: {
    posts: number;
  };
  article_count?: number; // 兼容旧版本
}

// 文章列表项类型
export interface Post {
  id: number;
  title: string;
  summary: string;
  cover_image: string;
  created_at: string;
  content: string;
}

// 文章列表查询参数
interface PostListQueryParams {
  id?: number;
  page?: number;
  page_size?: number;
  status?: number;
  category_id?: number;
  category_name?: string;
  tag_id?: number;
  tag_name?: string;
  user_id?: number;
  search?: string;
  exclude_category_name?: string;
  exclude_tag_name?: string;
}

// 标签接口类型
export interface Tag {
  id: number;
  name: string;
  article_count: number;
}

// API 函数

/**
 * 获取分类列表
 */
export const getCategoryList = async (): Promise<ApiResponse<Category[]> | undefined> => {
  return await apiFetch<Category[]>('/api/categories');
};

/**
 * 创建新分类
 */
export const createCategory = async (data: { name: string; description?: string }): Promise<ApiResponse<Category> | undefined> => {
  return await apiFetch<Category>('/api/categories', {
    method: 'POST',
    body: data
  });
};

/**
 * 获取文章列表（支持搜索、分类、标签筛选）
 */
export const getPostList = async (params: PostListQueryParams = {}): Promise<ApiResponse<PaginationResponse<Post>> | undefined> => {
  const queryParams = {
    id: params.id,
    page: params.page || 1,
    page_size: params.page_size || 10,
    category_id: params.category_id,
    category_name: params.category_name,
    tag_id: params.tag_id,
    tag_name: params.tag_name,
    user_id: params.user_id,
    search: params.search,
    status: params.status,
    exclude_category_name: params.exclude_category_name,
    exclude_tag_name: params.exclude_tag_name
  };

  return await apiFetch<PaginationResponse<Post>>('/api/articles', {
    params: queryParams
  });
};

/**
 * 创建新文章
 */
export const createPost = async (data: {
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  categoryId?: number;
  userId: number;
  status?: number;
}): Promise<ApiResponse<Post> | undefined> => {
  return await apiFetch<Post>('/api/articles', {
    method: 'POST',
    body: data
  });
};

/**
 * 获取所有标签及其文章数量
 */
export const getTagSimpleList = async (): Promise<ApiResponse<Tag[]> | undefined> => {
  return await apiFetch<Tag[]>('/api/tags');
};

/**
 * 创建新标签
 */
export const createTag = async (data: { name: string; description?: string }): Promise<ApiResponse<Tag> | undefined> => {
  return await apiFetch<Tag>('/api/tags', {
    method: 'POST',
    body: data
  });
};

// 用户相关接口类型
export interface User {
  id: number;
  username: string;
  nickname?: string;
  userType: number;
  userEmail?: string;
  userStatus: number;
  userPhone?: string;
  avatar?: string;
  sex?: number;
  remarks?: string;
  createTime: string;
  updateTime: string;
  _count?: {
    posts: number;
  };
}

/**
 * 获取用户列表
 */
export const getUserList = async (params: {
  page?: number;
  page_size?: number;
  user_type?: number;
  user_status?: number;
  search?: string;
} = {}): Promise<ApiResponse<PaginationResponse<User>> | undefined> => {
  const queryParams = {
    page: params.page || 1,
    page_size: params.page_size || 10,
    user_type: params.user_type,
    user_status: params.user_status,
    search: params.search
  };

  return await apiFetch<PaginationResponse<User>>('/api/users', {
    params: queryParams
  });
};

/**
 * 创建新用户
 */
export const createUser = async (data: {
  username: string;
  password: string;
  nickname?: string;
  userType?: number;
  userEmail?: string;
  userStatus?: number;
  userPhone?: string;
  avatar?: string;
  sex?: number;
  remarks?: string;
}): Promise<ApiResponse<User> | undefined> => {
  return await apiFetch<User>('/api/users', {
    method: 'POST',
    body: data
  });
};
