import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import { successResponse, errorResponse } from "@/api/response";

export async function GET(request: NextRequest) {
  try {
    console.log('开始获取分类列表...');

    // 查询所有分类并统计文章数量
    const queryText = `
      SELECT
        c.id,
        c.name,
        c.description,
        c.create_time as "createTime",
        c.update_time as "updateTime",
        COUNT(p.id) as post_count
      FROM category c
      LEFT JOIN post p ON c.id = p.category_id
      GROUP BY c.id, c.name, c.description, c.create_time, c.update_time
      ORDER BY c.create_time DESC
    `;

    const result = await query(queryText);
    console.log(`查询成功，找到 ${result.length} 个分类`);

    // 转换数据格式
    const categories = result.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createTime: row.createTime,
      updateTime: row.updateTime,
      _count: {
        posts: parseInt(row.post_count) || 0
      }
    }));

    return NextResponse.json(successResponse(categories));
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return NextResponse.json(
      errorResponse(`获取分类列表失败: ${error instanceof Error ? error.message : '未知错误'}`, 500),
      { status: 500 }
    );
  }
}

// 创建新分类的POST方法
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        errorResponse('分类名称不能为空'),
        { status: 400 }
      );
    }

    // 检查分类名称是否已存在
    const checkQuery = 'SELECT id FROM category WHERE name = $1';
    const checkResult = await query(checkQuery, [name]);

    if (checkResult.length > 0) {
      return NextResponse.json(
        errorResponse('分类名称已存在'),
        { status: 400 }
      );
    }

    // 创建新分类
    const insertQuery = `
      INSERT INTO category (name, description, create_time, update_time)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id, name, description, create_time as "createTime", update_time as "updateTime"
    `;

    const insertResult = await query(insertQuery, [name, description || null]);
    const newCategory = insertResult[0];

    const categoryData = {
      id: newCategory.id,
      name: newCategory.name,
      description: newCategory.description,
      createTime: newCategory.createTime,
      updateTime: newCategory.updateTime,
      _count: {
        posts: 0 // 新创建的分类文章数为0
      }
    };

    return NextResponse.json(successResponse(categoryData));
  } catch (error) {
    console.error('创建分类失败:', error);
    return NextResponse.json(
      errorResponse(`创建分类失败: ${error instanceof Error ? error.message : '未知错误'}`, 500),
      { status: 500 }
    );
  }
}
