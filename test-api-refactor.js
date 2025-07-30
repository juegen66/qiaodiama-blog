// 测试API重构的脚本
// 这个脚本用于验证新的API系统是否正常工作

const { apiFetch } = require('./api/fetch');

async function testApiRefactor() {
  console.log('🚀 开始测试API重构...\n');

  try {
    // 测试1: 获取分类列表
    console.log('📋 测试1: 获取分类列表');
    const categoriesResponse = await apiFetch('/api/categories');
    
    if (categoriesResponse && categoriesResponse.code === 200) {
      console.log('✅ 获取分类列表成功');
      console.log(`   - 返回格式: { code: ${categoriesResponse.code}, message: "${categoriesResponse.message}", data: [...] }`);
      console.log(`   - 分类数量: ${categoriesResponse.data?.length || 0}`);
    } else {
      console.log('❌ 获取分类列表失败');
      console.log(`   - 错误信息: ${categoriesResponse?.message || '未知错误'}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试2: 测试错误处理
    console.log('🔥 测试2: 测试错误处理（访问不存在的端点）');
    const errorResponse = await apiFetch('/api/nonexistent');
    
    if (!errorResponse) {
      console.log('✅ 错误处理正常 - 返回 undefined');
    } else {
      console.log('⚠️  错误处理异常 - 应该返回 undefined');
      console.log(`   - 实际返回: ${JSON.stringify(errorResponse)}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试3: 测试查询参数
    console.log('🔍 测试3: 测试查询参数');
    const searchResponse = await apiFetch('/api/test', {
      params: {
        q: 'test',
        page: 1,
        limit: 10
      }
    });

    console.log('✅ 查询参数测试完成');
    console.log(`   - 请求URL应包含: ?q=test&page=1&limit=10`);
    console.log(`   - 响应: ${searchResponse ? '有响应' : '无响应'}`);

    console.log('\n' + '='.repeat(50) + '\n');

    // 测试4: 测试POST请求
    console.log('📝 测试4: 测试POST请求（创建分类）');
    const createResponse = await apiFetch('/api/categories', {
      method: 'POST',
      body: {
        name: `测试分类_${Date.now()}`,
        description: '这是一个API重构测试分类'
      }
    });

    if (createResponse && createResponse.code === 200) {
      console.log('✅ 创建分类成功');
      console.log(`   - 新分类ID: ${createResponse.data?.id}`);
      console.log(`   - 新分类名称: ${createResponse.data?.name}`);
    } else {
      console.log('❌ 创建分类失败');
      console.log(`   - 错误信息: ${createResponse?.message || '未知错误'}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');
    console.log('🎉 API重构测试完成！');

  } catch (error) {
    console.error('💥 测试过程中发生异常:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testApiRefactor();
}

module.exports = { testApiRefactor };
