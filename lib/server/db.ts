import { Pool, PoolClient } from 'pg'
import { LogLevel, SystemLogData } from '@/types'

// 全局类型定义
declare global {
  var __db_pool: Pool | undefined
}

// 数据库连接池配置
const createPool = () => {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    // Vercel 部署优化配置
    max: 20, // 最大连接数
    min: 0,  // 最小连接数
    connectionTimeoutMillis: 5000, // 连接超时时间 (5秒)
    idleTimeoutMillis: 30000, // 空闲超时时间 (30秒)
    // SSL 配置（Vercel 部署时需要）
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })
}

// 单例模式的数据库连接池
export const db = globalThis.__db_pool ?? createPool()

// 开发环境下保存到全局变量，避免热重载时重复创建连接
if (process.env.NODE_ENV !== 'production') {
  globalThis.__db_pool = db
}

// 数据库查询辅助函数
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await db.connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } finally {
    client.release()
  }
}

// 获取单个结果
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(text, params)
  return results.length > 0 ? results[0] : null
}

// 事务执行函数
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// 优雅关闭连接池
export async function closeDb(): Promise<void> {
  if (globalThis.__db_pool) {
    await globalThis.__db_pool.end()
    globalThis.__db_pool = undefined
  }
}



// 从NextRequest获取客户端IP地址的辅助函数
export function getClientIP(request: Request): string | null {
  // 尝试从各种可能的头部获取真实IP
  const headers = request.headers;

  // 优先级顺序：x-forwarded-for > x-real-ip > x-client-ip > cf-connecting-ip
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for 可能包含多个IP，取第一个
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  const clientIP = headers.get('x-client-ip');
  if (clientIP) {
    return clientIP.trim();
  }

  // Cloudflare的连接IP
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }

  return null;
}

// 系统日志记录函数
export async function logSystem(logData: SystemLogData): Promise<void> {
  try {
    const insertQuery = `
      INSERT INTO system_log (
        log_level, source, message, user_id, ip_address, remarks,
        create_time, update_time
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `;

    await query(insertQuery, [
      logData.log_level,
      logData.source,
      logData.message,
      logData.user_id || null,
      logData.ip_address || null,
      logData.remarks || null
    ]);
  } catch (error) {
    // 日志记录失败时输出到控制台，避免影响主业务逻辑
    console.error('系统日志记录失败:', error);
  }
}

// 便捷的日志记录函数
export async function logInfo(source: string, message: string, userId?: number, ipAddress?: string, remarks?: string): Promise<void> {
  await logSystem({
    log_level: 'INFO',
    source,
    message,
    user_id: userId,
    ip_address: ipAddress,
    remarks
  });
}

export async function logWarn(source: string, message: string, userId?: number, ipAddress?: string, remarks?: string): Promise<void> {
  await logSystem({
    log_level: 'WARN',
    source,
    message,
    user_id: userId,
    ip_address: ipAddress,
    remarks
  });
}

export async function logError(source: string, message: string, userId?: number, ipAddress?: string, remarks?: string): Promise<void> {
  await logSystem({
    log_level: 'ERROR',
    source,
    message,
    user_id: userId,
    ip_address: ipAddress,
    remarks
  });
}

export async function logDebug(source: string, message: string, userId?: number, ipAddress?: string, remarks?: string): Promise<void> {
  await logSystem({
    log_level: 'DEBUG',
    source,
    message,
    user_id: userId,
    ip_address: ipAddress,
    remarks
  });
}

// Route Handler专用的日志记录函数
export async function logRouteHandler(
  request: Request,
  level: LogLevel,
  source: string,
  message: string,
  userId?: number,
  remarks?: string
): Promise<void> {
  const ipAddress = getClientIP(request);

  await logSystem({
    log_level: level,
    source,
    message,
    user_id: userId,
    ip_address: ipAddress,
    remarks
  });
}