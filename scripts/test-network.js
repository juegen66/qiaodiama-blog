// 测试网络连接的脚本
// 手动加载环境变量
require('dotenv').config();
const net = require('net');
const { URL } = require('url');

async function testNetworkConnection() {
  console.log('🔍 开始测试网络连接...\n');
  
  // 解析数据库 URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('❌ DATABASE_URL 环境变量未设置');
    return;
  }
  
  try {
    const url = new URL(dbUrl);
    const host = url.hostname;
    const port = parseInt(url.port) || 5432;
    
    console.log(`测试连接到: ${host}:${port}`);
    
    // 测试 TCP 连接
    const socket = new net.Socket();
    
    const connectPromise = new Promise((resolve, reject) => {
      socket.setTimeout(10000); // 10秒超时
      
      socket.on('connect', () => {
        console.log('✅ TCP 连接成功');
        socket.destroy();
        resolve(true);
      });
      
      socket.on('timeout', () => {
        console.log('❌ 连接超时');
        socket.destroy();
        reject(new Error('连接超时'));
      });
      
      socket.on('error', (err) => {
        console.log('❌ 连接错误:', err.message);
        reject(err);
      });
      
      socket.connect(port, host);
    });
    
    await connectPromise;
    console.log('🎉 网络连接测试成功！');
    
  } catch (error) {
    console.error('❌ 网络连接失败:', error.message);
    
    console.log('\n🔧 可能的解决方案:');
    console.log('1. 检查你的网络连接');
    console.log('2. 确认 Supabase 项目是否正在运行');
    console.log('3. 检查防火墙或代理设置');
    console.log('4. 尝试使用 VPN 或更换网络');
    console.log('5. 联系 Supabase 支持团队');
  }
}

// 运行测试
testNetworkConnection();
