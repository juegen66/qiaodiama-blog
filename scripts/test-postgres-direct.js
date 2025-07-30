// 直接测试 PostgreSQL 连接
require('dotenv').config();

async function testPostgresConnection() {
  console.log('🔍 开始测试 PostgreSQL 直接连接...\n');
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('❌ DATABASE_URL 环境变量未设置');
    return;
  }
  
  console.log('DATABASE_URL 已设置');
  console.log(`URL: ${dbUrl.replace(/:[^:@]*@/, ':****@')}\n`);
  
  try {
    // 尝试使用 node-postgres 直接连接
    const { Client } = require('pg');
    
    const client = new Client({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false // Supabase 需要 SSL
      }
    });
    
    console.log('尝试连接到 PostgreSQL...');
    await client.connect();
    console.log('✅ PostgreSQL 连接成功');
    
    // 测试简单查询
    const result = await client.query('SELECT version()');
    console.log('✅ 查询成功:', result.rows[0].version.substring(0, 50) + '...');
    
    await client.end();
    console.log('🎉 PostgreSQL 直接连接测试成功！');
    
  } catch (error) {
    console.error('❌ PostgreSQL 连接失败:', error.message);
    
    if (error.code) {
      console.error('错误代码:', error.code);
    }
    
    console.log('\n🔧 建议检查:');
    console.log('1. 数据库用户名和密码是否正确');
    console.log('2. 数据库是否允许外部连接');
    console.log('3. SSL 配置是否正确');
    console.log('4. Supabase 项目是否处于活跃状态');
  }
}

// 检查是否安装了 pg 包
try {
  require('pg');
  testPostgresConnection();
} catch (error) {
  console.log('❌ pg 包未安装，请运行: pnpm add pg');
  console.log('然后重新运行此脚本');
}
