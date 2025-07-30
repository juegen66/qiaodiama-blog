import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import { successResponse, errorResponse } from "@/api/response";

export async function GET(request: NextRequest) {
  try {
    console.log('开始获取标签列表...');

    // 查询所有标签并统计文章数量
    const queryText = `
      SELECT
        t.id,
        t.name,
        t.description,
        t.create_time as "createTime",
        t.update_time as "updateTime",
        COUNT(pt.post_id) as article_count
      FROM tag t
      LEFT JOIN post_tag pt ON t.id = pt.tag_id
      GROUP BY t.id, t.name, t.description, t.create_time, t.update_time
      ORDER BY t.create_time DESC
    `;

    const result = await query(queryText);
    console.log(`查询成功，找到 ${result.length} 个标签`);

    // 转换数据格式
    const tags = result.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createTime: row.createTime,
      updateTime: row.updateTime,
      article_count: parseInt(row.article_count) || 0
    }));

    return NextResponse.json(successResponse(tags));
  } catch (error) {
    console.error('获取标签列表失败:', error);
    return NextResponse.json(
      errorResponse(`获取标签列表失败: ${error instanceof Error ? error.message : '未知错误'}`, 500),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        errorResponse('标签名称不能为空'),
        { status: 400 }
      );
    }

    // 检查标签名称是否已存在
    const checkQuery = 'SELECT id FROM tag WHERE name = $1';
    const checkResult = await query(checkQuery, [name]);

    if (checkResult.length > 0) {
      return NextResponse.json(
        errorResponse('标签名称已存在'),
        { status: 400 }
      );
    }

    // 创建新标签
    const insertQuery = `
      INSERT INTO tag (name, description, create_time, update_time)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id, name, description, create_time as "createTime", update_time as "updateTime"
    `;

    const insertResult = await query(insertQuery, [name, description || null]);
    const newTag = insertResult[0];

    const tagData = {
      id: newTag.id,
      name: newTag.name,
      description: newTag.description,
      createTime: newTag.createTime,
      updateTime: newTag.updateTime,
      article_count: 0 // 新创建的标签文章数为0
    };

    return NextResponse.json(successResponse(tagData));
  } catch (error) {
    console.error('创建标签失败:', error);
    return NextResponse.json(
      errorResponse(`创建标签失败: ${error instanceof Error ? error.message : '未知错误'}`, 500),
      { status: 500 }
    );
  }
}
