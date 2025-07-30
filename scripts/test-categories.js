// 测试分类功能的脚本
const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function testCategories() {
  try {
    console.log('🔍 开始测试分类功能...\n');

    // 1. 测试数据库连接
    console.log('1. 测试数据库连接...');
    await prisma.$connect();
    console.log('✅ 数据库连接成功\n');

    // 2. 获取现有分类
    console.log('2. 获取现有分类...');
    const existingCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });
    console.log(`✅ 找到 ${existingCategories.length} 个现有分类:`);
    existingCategories.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat.id}, 文章数: ${cat._count.posts})`);
    });
    console.log('');

    // 3. 创建测试分类（如果不存在）
    console.log('3. 创建测试分类...');
    const testCategories = [
      { name: '技术分享', description: '分享技术心得和经验' },
      { name: '生活随笔', description: '记录生活点滴' },
      { name: '学习笔记', description: '学习过程中的笔记和总结' }
    ];

    for (const testCat of testCategories) {
      try {
        const existing = await prisma.category.findUnique({
          where: { name: testCat.name }
        });

        if (!existing) {
          const newCategory = await prisma.category.create({
            data: testCat
          });
          console.log(`✅ 创建分类: ${newCategory.name} (ID: ${newCategory.id})`);
        } else {
          console.log(`ℹ️  分类已存在: ${existing.name} (ID: ${existing.id})`);
        }
      } catch (error) {
        console.log(`❌ 创建分类失败: ${testCat.name} - ${error.message}`);
      }
    }
    console.log('');

    // 4. 再次获取所有分类
    console.log('4. 获取更新后的分类列表...');
    const allCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        createTime: 'desc'
      }
    });
    console.log(`✅ 总共 ${allCategories.length} 个分类:`);
    allCategories.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat.id}, 文章数: ${cat._count.posts}, 创建时间: ${cat.createTime.toLocaleString()})`);
    });
    console.log('');

    console.log('🎉 分类功能测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 数据库连接已断开');
  }
}

// 运行测试
testCategories();
