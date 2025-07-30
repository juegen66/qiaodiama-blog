# 系统日志功能使用指南

## 概述

本系统提供了完整的系统日志记录功能，用于记录后端Route Handler的操作日志。日志数据存储在PostgreSQL数据库的`system_log`表中。

## 功能特性

- ✅ 自动提取客户端IP地址
- ✅ 支持多种日志级别（INFO、WARN、ERROR、DEBUG）
- ✅ 支持用户关联和操作追踪
- ✅ 异步记录，不影响主业务逻辑
- ✅ 错误容错，日志记录失败不会影响API响应
- ✅ TypeScript类型支持

## 数据库表结构

```sql
-- system_log 表结构
CREATE TABLE system_log (
  id SERIAL PRIMARY KEY,
  create_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  log_level VARCHAR(20) NOT NULL,           -- 日志等级
  source VARCHAR(100) NOT NULL,             -- 日志来源模块
  message TEXT NOT NULL,                    -- 日志详细信息
  user_id INTEGER REFERENCES "user"(id),    -- 操作用户ID
  ip_address VARCHAR(45),                   -- 操作来源IP地址
  remarks VARCHAR(255)                      -- 备注或扩展信息
);
```

## 核心函数

### 1. Route Handler专用函数

```typescript
import { logRouteHandler } from "@/lib/server/db";

// 在Route Handler中使用，自动提取IP地址
await logRouteHandler(
  request,           // NextRequest对象
  'INFO',           // 日志级别
  'users/create',   // 来源模块
  '创建用户成功',    // 日志消息
  userId,           // 用户ID（可选）
  '额外信息'        // 备注（可选）
);
```

### 2. 独立日志函数

```typescript
import { logInfo, logWarn, logError, logDebug } from "@/lib/server/db";

// 用于后台任务或其他场景
await logInfo('background/cleanup', '数据清理完成', userId, ipAddress, '清理了100条记录');
await logWarn('auth/login', '登录失败', userId, ipAddress, '密码错误');
await logError('database/connection', '数据库连接失败', null, null, error.message);
await logDebug('api/test', '调试信息', userId, ipAddress, 'debug data');
```

### 3. 通用日志函数

```typescript
import { logSystem } from "@/lib/server/db";

await logSystem({
  log_level: 'INFO',
  source: 'custom/module',
  message: '自定义操作',
  user_id: 123,
  ip_address: '192.168.1.1',
  remarks: '自定义备注'
});
```

### 4. IP地址提取函数

```typescript
import { getClientIP } from "@/lib/server/db";

const ipAddress = getClientIP(request);
```

## 日志级别说明

| 级别  | 用途 | 示例场景 |
|-------|------|----------|
| INFO  | 正常业务操作记录 | 用户登录、创建文章、数据查询成功 |
| WARN  | 警告信息 | 登录失败、权限不足、参数验证失败 |
| ERROR | 系统错误 | 数据库连接失败、API异常、系统崩溃 |
| DEBUG | 调试信息 | 开发阶段的详细信息、参数追踪 |

## 来源模块命名规范

建议使用 `模块/操作` 的格式：

```typescript
// 用户认证相关
'auth/login'
'auth/logout'
'auth/register'

// 用户管理相关
'users/create'
'users/update'
'users/delete'
'users/list'

// 文章管理相关
'articles/create'
'articles/update'
'articles/delete'
'articles/publish'

// 后台任务相关
'background/cleanup'
'background/sync'
'background/backup'

// 系统相关
'system/startup'
'system/shutdown'
'database/migration'
```

## 使用示例

### 1. 在Route Handler中记录操作日志

```typescript
import { NextRequest, NextResponse } from "next/server";
import { logRouteHandler } from "@/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    // 记录操作开始
    await logRouteHandler(request, 'INFO', 'articles/create', '开始创建文章');
    
    const body = await request.json();
    const { title, content, userId } = body;
    
    // 验证参数
    if (!title || !content) {
      await logRouteHandler(
        request, 
        'WARN', 
        'articles/create', 
        '创建文章失败：缺少必填字段',
        userId,
        `缺失字段: ${!title ? 'title ' : ''}${!content ? 'content' : ''}`
      );
      return NextResponse.json({ error: '参数不完整' }, { status: 400 });
    }
    
    // 执行业务逻辑
    const result = await createArticle({ title, content, userId });
    
    // 记录成功
    await logRouteHandler(
      request, 
      'INFO', 
      'articles/create', 
      `文章创建成功: ${title}`,
      userId,
      `文章ID: ${result.id}`
    );
    
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    // 记录错误
    await logRouteHandler(
      request, 
      'ERROR', 
      'articles/create', 
      `创建文章异常: ${error.message}`,
      undefined,
      error.stack
    );
    
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
```

### 2. 在后台任务中记录日志

```typescript
import { logInfo, logError } from "@/lib/server/db";

export async function cleanupOldLogs() {
  try {
    await logInfo('background/cleanup', '开始清理过期日志');
    
    const result = await db.query(
      'DELETE FROM system_log WHERE create_time < NOW() - INTERVAL \'30 days\''
    );
    
    await logInfo(
      'background/cleanup', 
      `日志清理完成，删除了 ${result.rowCount} 条记录`,
      null,
      null,
      `清理30天前的日志`
    );
    
  } catch (error) {
    await logError(
      'background/cleanup',
      `日志清理失败: ${error.message}`,
      null,
      null,
      error.stack
    );
  }
}
```

### 3. 用户操作审计

```typescript
import { logInfo } from "@/lib/server/db";

export async function auditUserAction(
  userId: number,
  action: string,
  details: string,
  ipAddress?: string
) {
  await logInfo(
    'audit/user-action',
    `用户操作: ${action}`,
    userId,
    ipAddress,
    details
  );
}

// 使用示例
await auditUserAction(123, '修改个人资料', '更新了昵称和头像', '192.168.1.1');
```

## 最佳实践

### 1. 日志记录时机
- ✅ API调用开始时记录INFO日志
- ✅ 关键业务操作完成时记录INFO日志
- ✅ 参数验证失败时记录WARN日志
- ✅ 权限检查失败时记录WARN日志
- ✅ 系统异常时记录ERROR日志
- ✅ 调试信息使用DEBUG级别

### 2. 消息内容规范
- ✅ 消息简洁明了，描述具体操作
- ✅ 包含关键信息（如用户名、文章标题等）
- ✅ 避免记录敏感信息（如密码、token等）
- ✅ 使用统一的消息格式

### 3. 备注信息使用
- ✅ 记录额外的上下文信息
- ✅ 错误日志记录错误堆栈
- ✅ 记录关键参数值
- ✅ 记录操作结果统计

### 4. 性能考虑
- ✅ 日志记录是异步的，不会阻塞主业务
- ✅ 日志记录失败不会影响API响应
- ✅ 避免在循环中频繁记录日志
- ✅ 生产环境减少DEBUG级别日志

## 类型定义

```typescript
// 日志级别
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

// 系统日志数据结构
export interface SystemLogData {
  log_level: LogLevel;
  source: string;
  message: string;
  user_id?: number | null;
  ip_address?: string | null;
  remarks?: string | null;
}

// 完整的系统日志记录
export interface SystemLog {
  id: number;
  create_time: Date;
  update_time: Date;
  log_level: LogLevel;
  source: string;
  message: string;
  user_id?: number | null;
  ip_address?: string | null;
  remarks?: string | null;
}
```

## 注意事项

1. **错误处理**: 日志记录函数内部已经处理了异常，不会影响主业务逻辑
2. **IP地址获取**: 自动从多个HTTP头部获取真实IP地址
3. **用户ID**: 需要从JWT token或session中解析用户ID
4. **敏感信息**: 不要在日志中记录密码、token等敏感信息
5. **日志清理**: 建议定期清理过期日志，避免数据库膨胀

## 相关文件

- `lib/server/db.ts` - 核心日志函数实现
- `types/index.ts` - 类型定义
- `lib/server/system-log-example.ts` - 详细使用示例
- `app/api/users-with-logging/route.ts` - 实际集成示例
