// 初始化测试数据的脚本
// 使用原生数据库连接池创建一些测试数据

require('dotenv').config();
const { query, transaction } = require('../lib/server/db');

async function initTestData() {
  console.log('🚀 开始初始化测试数据...\n');

  try {
    await transaction(async (client) => {
      // 1. 创建测试用户
      console.log('👤 创建测试用户...');
      const users = [
        {
          username: 'admin',
          password: 'admin123', // 注意：实际应用中应该使用哈希密码
          nickname: '管理员',
          user_type: 1,
          user_email: 'admin@example.com',
          user_status: 1
        },
        {
          username: 'author1',
          password: 'author123',
          nickname: '作者一号',
          user_type: 2,
          user_email: 'author1@example.com',
          user_status: 1
        },
        {
          username: 'author2',
          password: 'author123',
          nickname: '作者二号',
          user_type: 2,
          user_email: 'author2@example.com',
          user_status: 1
        }
      ];

      const createdUsers = [];
      for (const user of users) {
        // 检查用户是否已存在
        const existingUser = await client.query('SELECT id FROM "user" WHERE username = $1', [user.username]);
        
        if (existingUser.rows.length === 0) {
          const result = await client.query(`
            INSERT INTO "user" (username, password, nickname, user_type, user_email, user_status, create_time, update_time)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            RETURNING id, username, nickname
          `, [user.username, user.password, user.nickname, user.user_type, user.user_email, user.user_status]);
          
          createdUsers.push(result.rows[0]);
          console.log(`✅ 创建用户: ${result.rows[0].username} (ID: ${result.rows[0].id})`);
        } else {
          createdUsers.push({ id: existingUser.rows[0].id, username: user.username });
          console.log(`ℹ️  用户已存在: ${user.username} (ID: ${existingUser.rows[0].id})`);
        }
      }

      // 2. 创建测试分类
      console.log('\n📂 创建测试分类...');
      const categories = [
        { name: '技术分享', description: '分享技术心得和经验' },
        { name: '生活随笔', description: '记录生活点滴' },
        { name: '学习笔记', description: '学习过程中的笔记和总结' },
        { name: '项目实战', description: '实际项目开发经验分享' }
      ];

      const createdCategories = [];
      for (const category of categories) {
        // 检查分类是否已存在
        const existingCategory = await client.query('SELECT id FROM category WHERE name = $1', [category.name]);
        
        if (existingCategory.rows.length === 0) {
          const result = await client.query(`
            INSERT INTO category (name, description, create_time, update_time)
            VALUES ($1, $2, NOW(), NOW())
            RETURNING id, name
          `, [category.name, category.description]);
          
          createdCategories.push(result.rows[0]);
          console.log(`✅ 创建分类: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
        } else {
          createdCategories.push({ id: existingCategory.rows[0].id, name: category.name });
          console.log(`ℹ️  分类已存在: ${category.name} (ID: ${existingCategory.rows[0].id})`);
        }
      }

      // 3. 创建测试标签
      console.log('\n🏷️  创建测试标签...');
      const tags = [
        { name: 'JavaScript', description: 'JavaScript相关内容' },
        { name: 'React', description: 'React框架相关' },
        { name: 'Node.js', description: 'Node.js后端开发' },
        { name: 'TypeScript', description: 'TypeScript类型系统' },
        { name: 'Next.js', description: 'Next.js全栈框架' },
        { name: '数据库', description: '数据库相关技术' }
      ];

      const createdTags = [];
      for (const tag of tags) {
        // 检查标签是否已存在
        const existingTag = await client.query('SELECT id FROM tag WHERE name = $1', [tag.name]);
        
        if (existingTag.rows.length === 0) {
          const result = await client.query(`
            INSERT INTO tag (name, description, create_time, update_time)
            VALUES ($1, $2, NOW(), NOW())
            RETURNING id, name
          `, [tag.name, tag.description]);
          
          createdTags.push(result.rows[0]);
          console.log(`✅ 创建标签: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
        } else {
          createdTags.push({ id: existingTag.rows[0].id, name: tag.name });
          console.log(`ℹ️  标签已存在: ${tag.name} (ID: ${existingTag.rows[0].id})`);
        }
      }

      // 4. 创建测试文章
      console.log('\n📝 创建测试文章...');
      const articles = [
        {
          title: 'Next.js 15 新特性详解',
          content: '本文详细介绍了Next.js 15版本的新特性，包括App Router的改进、服务端组件的优化等内容...',
          summary: 'Next.js 15带来了许多令人兴奋的新特性',
          category_index: 0, // 技术分享
          user_index: 1, // author1
          tag_indices: [0, 4] // JavaScript, Next.js
        },
        {
          title: 'PostgreSQL 性能优化实践',
          content: '在实际项目中，数据库性能往往是系统瓶颈。本文分享一些PostgreSQL性能优化的实践经验...',
          summary: '分享PostgreSQL数据库性能优化的实用技巧',
          category_index: 3, // 项目实战
          user_index: 1, // author1
          tag_indices: [5] // 数据库
        },
        {
          title: 'React Hooks 最佳实践',
          content: 'React Hooks改变了我们编写React组件的方式。本文总结了一些使用Hooks的最佳实践...',
          summary: '总结React Hooks的使用技巧和最佳实践',
          category_index: 2, // 学习笔记
          user_index: 2, // author2
          tag_indices: [0, 1] // JavaScript, React
        },
        {
          title: 'TypeScript 类型系统深入理解',
          content: 'TypeScript的类型系统是其核心特性。本文深入探讨了TypeScript类型系统的高级用法...',
          summary: '深入理解TypeScript的类型系统',
          category_index: 2, // 学习笔记
          user_index: 2, // author2
          tag_indices: [0, 3] // JavaScript, TypeScript
        },
        {
          title: '我的编程学习之路',
          content: '回顾自己的编程学习历程，从初学者到现在的成长过程，希望能给其他学习者一些启发...',
          summary: '分享个人的编程学习经历和心得',
          category_index: 1, // 生活随笔
          user_index: 2, // author2
          tag_indices: [] // 无标签
        }
      ];

      for (const article of articles) {
        // 检查文章是否已存在
        const existingArticle = await client.query('SELECT id FROM post WHERE title = $1', [article.title]);
        
        if (existingArticle.rows.length === 0) {
          const result = await client.query(`
            INSERT INTO post (title, content, summary, category_id, user_id, status, views, create_time, update_time)
            VALUES ($1, $2, $3, $4, $5, 1, 0, NOW(), NOW())
            RETURNING id, title
          `, [
            article.title,
            article.content,
            article.summary,
            createdCategories[article.category_index].id,
            createdUsers[article.user_index].id
          ]);
          
          const postId = result.rows[0].id;
          console.log(`✅ 创建文章: ${result.rows[0].title} (ID: ${postId})`);

          // 添加文章标签关联
          for (const tagIndex of article.tag_indices) {
            await client.query(`
              INSERT INTO post_tag (post_id, tag_id)
              VALUES ($1, $2)
            `, [postId, createdTags[tagIndex].id]);
            console.log(`   🏷️  添加标签: ${createdTags[tagIndex].name}`);
          }
        } else {
          console.log(`ℹ️  文章已存在: ${article.title} (ID: ${existingArticle.rows[0].id})`);
        }
      }

      console.log('\n🎉 测试数据初始化完成！');
    });

    // 5. 显示统计信息
    console.log('\n📊 数据统计:');
    const userCount = await query('SELECT COUNT(*) as count FROM "user"');
    const categoryCount = await query('SELECT COUNT(*) as count FROM category');
    const tagCount = await query('SELECT COUNT(*) as count FROM tag');
    const postCount = await query('SELECT COUNT(*) as count FROM post');

    console.log(`👤 用户数量: ${userCount[0].count}`);
    console.log(`📂 分类数量: ${categoryCount[0].count}`);
    console.log(`🏷️  标签数量: ${tagCount[0].count}`);
    console.log(`📝 文章数量: ${postCount[0].count}`);

  } catch (error) {
    console.error('❌ 初始化测试数据失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initTestData()
    .then(() => {
      console.log('\n✅ 脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { initTestData };
