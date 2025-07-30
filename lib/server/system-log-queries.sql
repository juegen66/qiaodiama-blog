-- 系统日志相关SQL查询
-- 用于查看、分析和管理系统日志数据

-- 1. 查看最近的系统日志（最近100条）
SELECT 
  id,
  create_time,
  log_level,
  source,
  message,
  user_id,
  ip_address,
  remarks
FROM system_log 
ORDER BY create_time DESC 
LIMIT 100;

-- 2. 按日志级别统计
SELECT 
  log_level,
  COUNT(*) as count,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
FROM system_log 
GROUP BY log_level 
ORDER BY count DESC;

-- 3. 按来源模块统计
SELECT 
  source,
  COUNT(*) as count,
  COUNT(DISTINCT user_id) as unique_users,
  MIN(create_time) as first_log,
  MAX(create_time) as last_log
FROM system_log 
GROUP BY source 
ORDER BY count DESC;

-- 4. 查看特定用户的操作日志
SELECT 
  create_time,
  log_level,
  source,
  message,
  ip_address,
  remarks
FROM system_log 
WHERE user_id = 123  -- 替换为实际用户ID
ORDER BY create_time DESC;

-- 5. 查看错误日志
SELECT 
  create_time,
  source,
  message,
  user_id,
  ip_address,
  remarks
FROM system_log 
WHERE log_level = 'ERROR'
ORDER BY create_time DESC;

-- 6. 查看特定时间范围的日志
SELECT 
  create_time,
  log_level,
  source,
  message,
  user_id,
  ip_address
FROM system_log 
WHERE create_time >= '2024-01-01 00:00:00'
  AND create_time <= '2024-12-31 23:59:59'
ORDER BY create_time DESC;

-- 7. 按IP地址统计访问情况
SELECT 
  ip_address,
  COUNT(*) as request_count,
  COUNT(DISTINCT user_id) as unique_users,
  MIN(create_time) as first_access,
  MAX(create_time) as last_access
FROM system_log 
WHERE ip_address IS NOT NULL
GROUP BY ip_address 
ORDER BY request_count DESC;

-- 8. 查看登录相关日志
SELECT 
  create_time,
  log_level,
  message,
  user_id,
  ip_address,
  remarks
FROM system_log 
WHERE source LIKE 'auth/%'
ORDER BY create_time DESC;

-- 9. 按小时统计日志数量（最近24小时）
SELECT 
  DATE_TRUNC('hour', create_time) as hour,
  COUNT(*) as log_count,
  COUNT(CASE WHEN log_level = 'ERROR' THEN 1 END) as error_count,
  COUNT(CASE WHEN log_level = 'WARN' THEN 1 END) as warn_count
FROM system_log 
WHERE create_time >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', create_time)
ORDER BY hour DESC;

-- 10. 查看最活跃的用户
SELECT 
  u.username,
  u.nickname,
  sl.user_id,
  COUNT(*) as activity_count,
  MAX(sl.create_time) as last_activity
FROM system_log sl
JOIN "user" u ON sl.user_id = u.id
WHERE sl.user_id IS NOT NULL
GROUP BY u.username, u.nickname, sl.user_id
ORDER BY activity_count DESC
LIMIT 20;

-- 11. 查看系统异常趋势（按天统计错误日志）
SELECT 
  DATE(create_time) as date,
  COUNT(*) as error_count,
  COUNT(DISTINCT source) as affected_modules,
  COUNT(DISTINCT user_id) as affected_users
FROM system_log 
WHERE log_level = 'ERROR'
  AND create_time >= NOW() - INTERVAL '30 days'
GROUP BY DATE(create_time)
ORDER BY date DESC;

-- 12. 查看特定模块的详细日志
SELECT 
  create_time,
  log_level,
  message,
  user_id,
  ip_address,
  remarks
FROM system_log 
WHERE source = 'users/create'  -- 替换为实际模块名
ORDER BY create_time DESC;

-- 13. 清理过期日志（删除30天前的日志）
-- 注意：这是删除操作，请谨慎执行
-- DELETE FROM system_log WHERE create_time < NOW() - INTERVAL '30 days';

-- 14. 查看日志存储统计
SELECT 
  COUNT(*) as total_logs,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(DISTINCT source) as unique_sources,
  MIN(create_time) as oldest_log,
  MAX(create_time) as newest_log,
  pg_size_pretty(pg_total_relation_size('system_log')) as table_size
FROM system_log;

-- 15. 创建日志查询的视图（可选）
CREATE OR REPLACE VIEW v_system_log_summary AS
SELECT 
  sl.id,
  sl.create_time,
  sl.log_level,
  sl.source,
  sl.message,
  sl.user_id,
  u.username,
  u.nickname,
  sl.ip_address,
  sl.remarks
FROM system_log sl
LEFT JOIN "user" u ON sl.user_id = u.id;

-- 使用视图查询
-- SELECT * FROM v_system_log_summary ORDER BY create_time DESC LIMIT 50;

-- 16. 创建索引以提高查询性能（如果还没有的话）
-- CREATE INDEX IF NOT EXISTS idx_system_log_create_time ON system_log(create_time);
-- CREATE INDEX IF NOT EXISTS idx_system_log_user_id ON system_log(user_id);
-- CREATE INDEX IF NOT EXISTS idx_system_log_source ON system_log(source);
-- CREATE INDEX IF NOT EXISTS idx_system_log_level ON system_log(log_level);
-- CREATE INDEX IF NOT EXISTS idx_system_log_ip_address ON system_log(ip_address);

-- 17. 查看今日活动摘要
SELECT 
  COUNT(*) as total_logs_today,
  COUNT(CASE WHEN log_level = 'INFO' THEN 1 END) as info_count,
  COUNT(CASE WHEN log_level = 'WARN' THEN 1 END) as warn_count,
  COUNT(CASE WHEN log_level = 'ERROR' THEN 1 END) as error_count,
  COUNT(CASE WHEN log_level = 'DEBUG' THEN 1 END) as debug_count,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(DISTINCT source) as active_modules
FROM system_log 
WHERE DATE(create_time) = CURRENT_DATE;

-- 18. 查看异常IP地址（可能的攻击或异常访问）
SELECT 
  ip_address,
  COUNT(*) as request_count,
  COUNT(CASE WHEN log_level = 'ERROR' THEN 1 END) as error_count,
  COUNT(CASE WHEN log_level = 'WARN' THEN 1 END) as warn_count,
  MIN(create_time) as first_seen,
  MAX(create_time) as last_seen,
  COUNT(DISTINCT source) as accessed_modules
FROM system_log 
WHERE ip_address IS NOT NULL
  AND create_time >= NOW() - INTERVAL '24 hours'
GROUP BY ip_address
HAVING COUNT(*) > 100  -- 24小时内超过100次请求
   OR COUNT(CASE WHEN log_level = 'ERROR' THEN 1 END) > 10  -- 或超过10次错误
ORDER BY request_count DESC;

-- 19. 查看用户行为模式
SELECT 
  u.username,
  sl.user_id,
  COUNT(*) as total_actions,
  COUNT(DISTINCT DATE(sl.create_time)) as active_days,
  COUNT(DISTINCT sl.source) as used_features,
  MIN(sl.create_time) as first_activity,
  MAX(sl.create_time) as last_activity,
  ROUND(COUNT(*)::numeric / COUNT(DISTINCT DATE(sl.create_time)), 2) as avg_actions_per_day
FROM system_log sl
JOIN "user" u ON sl.user_id = u.id
WHERE sl.create_time >= NOW() - INTERVAL '30 days'
GROUP BY u.username, sl.user_id
ORDER BY total_actions DESC;

-- 20. 系统健康检查查询
SELECT 
  'System Health Check' as report_type,
  COUNT(*) as total_logs_last_hour,
  COUNT(CASE WHEN log_level = 'ERROR' THEN 1 END) as errors_last_hour,
  COUNT(CASE WHEN log_level = 'WARN' THEN 1 END) as warnings_last_hour,
  CASE 
    WHEN COUNT(CASE WHEN log_level = 'ERROR' THEN 1 END) = 0 THEN '✅ 健康'
    WHEN COUNT(CASE WHEN log_level = 'ERROR' THEN 1 END) < 5 THEN '⚠️ 注意'
    ELSE '❌ 异常'
  END as health_status
FROM system_log 
WHERE create_time >= NOW() - INTERVAL '1 hour';
