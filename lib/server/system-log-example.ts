import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import { successResponse, errorResponse } from "@/api/response";
import { 
  logRouteHandler, 
  logInfo, 
  logWarn, 
  logError,
  getClientIP 
} from "@/lib/server/db";

/**
 * 系统日志使用示例
 * 
 * 这个文件展示了如何在Next.js Route Handler中使用系统日志函数
 */

// 示例1: 在用户登录API中使用日志记录
export async function loginExample(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // 记录登录尝试
    await logRouteHandler(
      request,
      'INFO',
      'auth/login',
      `用户尝试登录: ${username}`,
      undefined, // 登录前还没有用户ID
      `登录请求参数: ${JSON.stringify({ username })}`
    );

    // 验证用户凭据（示例）
    const userQuery = 'SELECT id, username, password FROM "user" WHERE username = $1';
    const userResult = await query(userQuery, [username]);

    if (userResult.length === 0) {
      // 记录登录失败 - 用户不存在
      await logRouteHandler(
        request,
        'WARN',
        'auth/login',
        `登录失败: 用户不存在 - ${username}`,
        undefined,
        '用户名不存在'
      );
      
      return NextResponse.json(
        errorResponse('用户名或密码错误'),
        { status: 401 }
      );
    }

    const user = userResult[0];
    
    // 这里应该验证密码哈希，示例中简化处理
    if (user.password !== password) {
      // 记录登录失败 - 密码错误
      await logRouteHandler(
        request,
        'WARN',
        'auth/login',
        `登录失败: 密码错误 - ${username}`,
        user.id,
        '密码验证失败'
      );
      
      return NextResponse.json(
        errorResponse('用户名或密码错误'),
        { status: 401 }
      );
    }

    // 登录成功，记录日志
    await logRouteHandler(
      request,
      'INFO',
      'auth/login',
      `用户登录成功: ${username}`,
      user.id,
      '登录验证通过'
    );

    // 更新用户最后登录时间和IP
    const updateQuery = `
      UPDATE "user" 
      SET login_time = NOW(), client_host = $1 
      WHERE id = $2
    `;
    await query(updateQuery, [getClientIP(request), user.id]);

    return NextResponse.json(successResponse({
      id: user.id,
      username: user.username
    }));

  } catch (error) {
    // 记录系统错误
    await logRouteHandler(
      request,
      'ERROR',
      'auth/login',
      `登录处理异常: ${error instanceof Error ? error.message : '未知错误'}`,
      undefined,
      `错误堆栈: ${error instanceof Error ? error.stack : 'N/A'}`
    );

    return NextResponse.json(
      errorResponse('登录处理失败'),
      { status: 500 }
    );
  }
}

// 示例2: 在文章创建API中使用日志记录
export async function createArticleExample(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, categoryId, userId } = body;

    // 记录文章创建开始
    await logRouteHandler(
      request,
      'INFO',
      'article/create',
      `开始创建文章: ${title}`,
      userId,
      `分类ID: ${categoryId}, 内容长度: ${content?.length || 0}`
    );

    // 验证必填字段
    if (!title || !content || !userId) {
      await logRouteHandler(
        request,
        'WARN',
        'article/create',
        '文章创建失败: 缺少必填字段',
        userId,
        `缺失字段: ${!title ? 'title ' : ''}${!content ? 'content ' : ''}${!userId ? 'userId' : ''}`
      );
      
      return NextResponse.json(
        errorResponse('标题、内容和用户ID不能为空'),
        { status: 400 }
      );
    }

    // 创建文章
    const insertQuery = `
      INSERT INTO post (title, content, category_id, user_id, create_time, update_time)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, title
    `;
    
    const result = await query(insertQuery, [title, content, categoryId, userId]);
    const newArticle = result[0];

    // 记录文章创建成功
    await logRouteHandler(
      request,
      'INFO',
      'article/create',
      `文章创建成功: ${title} (ID: ${newArticle.id})`,
      userId,
      `新文章ID: ${newArticle.id}`
    );

    return NextResponse.json(successResponse(newArticle));

  } catch (error) {
    // 记录创建文章的错误
    await logRouteHandler(
      request,
      'ERROR',
      'article/create',
      `文章创建异常: ${error instanceof Error ? error.message : '未知错误'}`,
      undefined,
      `错误详情: ${error instanceof Error ? error.stack : 'N/A'}`
    );

    return NextResponse.json(
      errorResponse('文章创建失败'),
      { status: 500 }
    );
  }
}

// 示例3: 使用独立的日志函数（不依赖request对象）
export async function backgroundTaskExample() {
  try {
    // 记录后台任务开始
    await logInfo(
      'background/cleanup',
      '开始执行数据清理任务',
      undefined, // 后台任务通常没有特定用户
      undefined, // 后台任务没有IP地址
      '定时任务触发'
    );

    // 执行一些后台操作...
    const cleanupQuery = 'DELETE FROM system_log WHERE create_time < NOW() - INTERVAL \'30 days\'';
    const result = await query(cleanupQuery);

    // 记录清理结果
    await logInfo(
      'background/cleanup',
      `数据清理完成，删除了 ${result.length} 条记录`,
      undefined,
      undefined,
      `清理30天前的日志记录`
    );

  } catch (error) {
    // 记录后台任务错误
    await logError(
      'background/cleanup',
      `数据清理任务失败: ${error instanceof Error ? error.message : '未知错误'}`,
      undefined,
      undefined,
      `错误堆栈: ${error instanceof Error ? error.stack : 'N/A'}`
    );
  }
}

// 示例4: 在中间件或工具函数中使用
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

/**
 * 使用指南:
 * 
 * 1. 在Route Handler中使用 logRouteHandler() 函数，它会自动提取IP地址
 * 2. 在后台任务或其他场景中使用 logInfo/logWarn/logError/logDebug 函数
 * 3. 日志级别说明:
 *    - INFO: 正常的业务操作记录
 *    - WARN: 警告信息，如验证失败、权限不足等
 *    - ERROR: 系统错误，如数据库连接失败、异常等
 *    - DEBUG: 调试信息，开发阶段使用
 * 
 * 4. source字段建议使用模块/功能的格式，如:
 *    - 'auth/login', 'auth/logout'
 *    - 'article/create', 'article/update', 'article/delete'
 *    - 'user/register', 'user/profile'
 *    - 'background/cleanup', 'background/sync'
 * 
 * 5. message字段应该简洁明了，描述具体的操作或事件
 * 
 * 6. remarks字段用于存储额外的上下文信息，如参数、错误堆栈等
 */
