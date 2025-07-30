# API重构说明

本次重构将项目中的axios请求全部替换为自定义的fetch封装，并使用统一的返回类型。

## 重构内容

### 1. 删除的文件
- `api/index.ts` - 原axios配置文件

### 2. 新增/更新的文件

#### `api/response.ts` - 统一返回类型
```typescript
// 统一的API响应类型
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

// 响应构造函数
export const successResponse = <T>(data: T): ApiResponse<T>
export const errorResponse = (message: string, code?: number): ApiResponse<null>
```

#### `api/fetch.ts` - 增强的fetch封装
- 支持查询参数自动构建
- 自动添加Authorization头
- 6分钟超时控制
- 统一错误处理和提示
- 返回统一的ApiResponse格式

#### `api/article.ts` - 重构的API函数
```typescript
// 所有函数现在返回 Promise<ApiResponse<T> | undefined>
export const getCategoryList = async (): Promise<ApiResponse<Category[]> | undefined>
export const createCategory = async (data: {...}): Promise<ApiResponse<Category> | undefined>
export const getPostList = async (params: {...}): Promise<ApiResponse<PaginationResponse<Post>> | undefined>
export const getTagSimpleList = async (): Promise<ApiResponse<Tag[]> | undefined>
```

### 3. 更新的后端路由

#### `app/api/categories/route.ts`
- 使用 `successResponse()` 和 `errorResponse()` 构造返回数据
- 统一的错误处理格式
- 支持GET和POST方法，用于获取和创建分类

## 使用方法

### 基本用法
```typescript
import { getCategoryList } from '@/api/article';

const fetchCategories = async () => {
  const response = await getCategoryList();
  
  if (response && response.code === 200) {
    console.log('分类列表:', response.data);
  } else {
    console.error('获取失败:', response?.message);
  }
};
```

### 自定义请求
```typescript
import { apiFetch } from '@/api/fetch';

const customRequest = async () => {
  // GET请求
  const response = await apiFetch<DataType>('/api/endpoint');
  
  // POST请求
  const postResponse = await apiFetch<DataType>('/api/endpoint', {
    method: 'POST',
    body: { key: 'value' }
  });
  
  // 带查询参数
  const queryResponse = await apiFetch<DataType>('/api/search', {
    params: { q: 'search', page: 1 }
  });
};
```

## 主要改进

1. **统一的返回格式**: 所有API响应都遵循相同的结构
2. **更好的类型安全**: 完整的TypeScript类型支持
3. **自动错误处理**: 网络错误和HTTP错误的统一处理
4. **查询参数支持**: 自动构建URL查询字符串
5. **Token管理**: 自动添加Authorization头
6. **超时控制**: 防止请求无限等待
7. **用户友好**: 自动显示错误提示

## 迁移指南

如果有其他文件使用了旧的axios API，请按以下步骤迁移：

1. 将 `import request from '@/api/index'` 改为 `import { apiFetch } from '@/api/fetch'`
2. 将 `request.get()` 改为 `apiFetch(url, { params: {...} })`
3. 将 `request.post()` 改为 `apiFetch(url, { method: 'POST', body: {...} })`
4. 更新响应处理逻辑以适配新的返回格式
5. 添加适当的错误处理

## 示例代码

详细的使用示例请参考 `api/example-usage.ts` 文件。
