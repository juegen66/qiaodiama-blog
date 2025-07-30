// 测试数据库连接的脚本
// 手动加载环境变量
require('dotenv').config();
const { PrismaClient } = require('../app/generated/prisma');

async function testDatabaseConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    console.log('🔍 开始测试数据库连接...\n');
    
    // 检查环境变量
    console.log('1. 检查环境变量...');
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.log('❌ DATABASE_URL 环境变量未设置');
      return;
    }
    console.log('✅ DATABASE_URL 已设置');
    console.log(`   URL: ${dbUrl.replace(/:[^:@]*@/, ':****@')}\n`); // 隐藏密码
    
    // 测试基本连接
    console.log('2. 测试数据库连接...');
    await prisma.$connect();
    console.log('✅ 数据库连接成功\n');
    
    // 测试简单查询
    console.log('3. 测试简单查询...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ 查询测试成功:', result);
    console.log('');
    
    // 测试表是否存在
    console.log('4. 检查分类表是否存在...');
    try {
      const count = await prisma.category.count();
      console.log(`✅ 分类表存在，当前有 ${count} 条记录\n`);
    } catch (error) {
      console.log('❌ 分类表不存在或查询失败:', error.message);
      console.log('   可能需要运行数据库迁移\n');
    }
    
    console.log('🎉 数据库连接测试完成！');
    
  } catch (error) {
    console.error('❌ 数据库连接失败:');
    console.error('错误类型:', error.constructor.name);
    console.error('错误信息:', error.message);
    
    if (error.code) {
      console.error('错误代码:', error.code);
    }
    
    // 提供解决建议
    console.log('\n🔧 可能的解决方案:');
    console.log('1. 检查网络连接是否正常');
    console.log('2. 确认 Supabase 数据库是否正在运行');
    console.log('3. 验证数据库连接字符串是否正确');
    console.log('4. 检查防火墙设置');
    console.log('5. 尝试重新启动 Supabase 项目');
    
  } finally {
    await prisma.$disconnect();
    console.log('🔌 数据库连接已断开');
  }
}

// 运行测试
testDatabaseConnection();
