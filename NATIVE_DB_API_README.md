# 原生数据库API系统

本项目现在完全使用原生PostgreSQL连接池，不再依赖Prisma ORM。所有API都通过自定义的数据库连接池进行数据操作。

## 系统架构

### 数据库连接层
- **连接池**: `lib/server/db.ts` - 使用pg库的连接池
- **查询函数**: `query()`, `queryOne()`, `transaction()`
- **连接管理**: 自动连接复用和释放

### API路由层
- **分类API**: `app/api/categories/route.ts`
- **文章API**: `app/api/articles/route.ts`
- **标签API**: `app/api/tags/route.ts`
- **用户API**: `app/api/users/route.ts`

### 客户端API层
- **统一封装**: `api/article.ts` - 封装所有API调用
- **Fetch封装**: `api/fetch.ts` - 统一的HTTP请求处理
- **类型定义**: `api/response.ts` - 统一的响应格式

## 数据库表结构

基于Prisma schema，但使用原生SQL查询：

### 用户表 (user)
```sql
- id: 主键，自增
- username: 用户名，唯一
- password: 密码哈希
- nickname: 昵称
- user_type: 用户类型 (0超级管理员, 1管理员, 2普通用户)
- user_email: 邮箱，唯一
- user_status: 状态 (0未激活, 1正常, 2禁用)
- user_phone: 手机号，唯一
- create_time, update_time: 时间戳
```

### 分类表 (category)
```sql
- id: 主键，自增
- name: 分类名称，唯一
- description: 分类描述
- create_time, update_time: 时间戳
```

### 标签表 (tag)
```sql
- id: 主键，自增
- name: 标签名称，唯一
- description: 标签描述
- create_time, update_time: 时间戳
```

### 文章表 (post)
```sql
- id: 主键，自增
- title: 文章标题
- content: 文章内容
- summary: 文章摘要
- cover_image: 封面图片URL
- status: 状态 (1发布, 0草稿)
- views: 浏览次数
- user_id: 作者ID (外键)
- category_id: 分类ID (外键)
- create_time, update_time: 时间戳
```

### 文章标签关联表 (post_tag)
```sql
- post_id: 文章ID (外键)
- tag_id: 标签ID (外键)
- 复合主键 (post_id, tag_id)
```

## API接口

### 分类相关
```typescript
// 获取分类列表
GET /api/categories
Response: { code: 200, message: "success", data: Category[] }

// 创建分类
POST /api/categories
Body: { name: string, description?: string }
Response: { code: 200, message: "success", data: Category }
```

### 文章相关
```typescript
// 获取文章列表（支持分页和筛选）
GET /api/articles?page=1&page_size=10&category_id=1&tag_id=1&search=关键词
Response: { code: 200, message: "success", data: PaginationResponse<Post> }

// 创建文章
POST /api/articles
Body: { title: string, content: string, summary?: string, categoryId?: number, userId: number }
Response: { code: 200, message: "success", data: Post }
```

### 标签相关
```typescript
// 获取标签列表
GET /api/tags
Response: { code: 200, message: "success", data: Tag[] }

// 创建标签
POST /api/tags
Body: { name: string, description?: string }
Response: { code: 200, message: "success", data: Tag }
```

### 用户相关
```typescript
// 获取用户列表（支持分页和筛选）
GET /api/users?page=1&page_size=10&user_type=2&search=关键词
Response: { code: 200, message: "success", data: PaginationResponse<User> }

// 创建用户
POST /api/users
Body: { username: string, password: string, nickname?: string, userEmail?: string }
Response: { code: 200, message: "success", data: User }
```

## 客户端使用方法

### 基本用法
```typescript
import { getCategoryList, createCategory } from '@/api/article';

// 获取分类列表
const response = await getCategoryList();
if (response && response.code === 200) {
  console.log('分类列表:', response.data);
}

// 创建分类
const newCategory = await createCategory({
  name: '技术分享',
  description: '技术相关的文章'
});
```

### 分页查询
```typescript
import { getPostList, getUserList } from '@/api/article';

// 获取文章列表
const articles = await getPostList({
  page: 1,
  page_size: 10,
  category_id: 1,
  search: '关键词'
});

// 获取用户列表
const users = await getUserList({
  page: 1,
  page_size: 20,
  user_status: 1
});
```

## 主要特性

1. **原生SQL查询**: 直接使用PostgreSQL，性能更好
2. **连接池管理**: 自动管理数据库连接，支持高并发
3. **统一响应格式**: 所有API返回相同的数据结构
4. **完整的类型支持**: TypeScript类型定义完整
5. **分页支持**: 内置分页查询功能
6. **关联查询**: 支持JOIN查询，如统计文章数量
7. **条件筛选**: 支持多种筛选条件
8. **错误处理**: 完善的错误处理和日志记录

## 测试

运行测试脚本验证API功能：

```bash
# 测试原生数据库API
node test-native-db-api.js

# 测试数据库连接
node scripts/test-postgres-direct.js
```

## 部署注意事项

1. **环境变量**: 确保设置正确的 `DATABASE_URL`
2. **SSL配置**: 生产环境自动启用SSL连接
3. **连接池配置**: 根据服务器配置调整连接池参数
4. **数据库迁移**: 确保数据库表结构与schema一致

## 性能优化

1. **索引优化**: 在常用查询字段上创建索引
2. **查询优化**: 使用JOIN减少N+1查询问题
3. **连接池调优**: 根据并发需求调整连接池大小
4. **缓存策略**: 可以在API层添加Redis缓存
