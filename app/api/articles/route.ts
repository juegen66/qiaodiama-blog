import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import { successResponse, errorResponse } from "@/api/response";

export async function GET(request: NextRequest) {
  try {
    console.log('开始获取文章列表...');

    // 从URL参数中获取查询条件
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page_size') || '10');
    const categoryId = searchParams.get('category_id');
    const tagId = searchParams.get('tag_id');
    const userId = searchParams.get('user_id');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // 构建WHERE条件
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (categoryId) {
      conditions.push(`p.category_id = $${paramIndex++}`);
      params.push(parseInt(categoryId));
    }

    if (userId) {
      conditions.push(`p.user_id = $${paramIndex++}`);
      params.push(parseInt(userId));
    }

    if (status) {
      conditions.push(`p.status = $${paramIndex++}`);
      params.push(parseInt(status));
    }

    if (search) {
      conditions.push(`(p.title ILIKE $${paramIndex++} OR p.content ILIKE $${paramIndex++})`);
      params.push(`%${search}%`, `%${search}%`);
    }

    // 如果有标签筛选，需要JOIN post_tag表
    let joinClause = '';
    if (tagId) {
      joinClause = 'INNER JOIN post_tag pt ON p.id = pt.post_id';
      conditions.push(`pt.tag_id = $${paramIndex++}`);
      params.push(parseInt(tagId));
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 查询总数
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM post p
      LEFT JOIN category c ON p.category_id = c.id
      LEFT JOIN "user" u ON p.user_id = u.id
      ${joinClause}
      ${whereClause}
    `;

    const countResult = await query(countQuery, params);
    const total = parseInt(countResult[0].total);

    // 计算分页
    const offset = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    // 查询文章列表
    const articlesQuery = `
      SELECT DISTINCT
        p.id,
        p.title,
        p.summary,
        p.cover_image,
        p.status,
        p.views,
        p.create_time as created_at,
        p.update_time as updated_at,
        p.content,
        c.name as category_name,
        u.username as author_name
      FROM post p
      LEFT JOIN category c ON p.category_id = c.id
      LEFT JOIN "user" u ON p.user_id = u.id
      ${joinClause}
      ${whereClause}
      ORDER BY p.create_time DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    params.push(pageSize, offset);

    const articles = await query(articlesQuery, params);

    console.log(`查询成功，找到 ${articles.length} 篇文章，总计 ${total} 篇`);

    // 构建分页响应
    const paginationResponse = {
      items: articles,
      total,
      page,
      page_size: pageSize,
      total_pages: totalPages
    };

    return NextResponse.json(successResponse(paginationResponse));
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return NextResponse.json(
      errorResponse(`获取文章列表失败: ${error instanceof Error ? error.message : '未知错误'}`, 500),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, summary, coverImage, categoryId, userId, status = 1 } = body;

    if (!title || !content || !userId) {
      return NextResponse.json(
        errorResponse('标题、内容和用户ID不能为空'),
        { status: 400 }
      );
    }

    // 创建新文章
    const insertQuery = `
      INSERT INTO post (title, content, summary, cover_image, category_id, user_id, status, create_time, update_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, title, content, summary, cover_image, category_id, user_id, status, views, create_time as created_at, update_time as updated_at
    `;

    const insertResult = await query(insertQuery, [
      title,
      content,
      summary || null,
      coverImage || null,
      categoryId || null,
      userId,
      status
    ]);

    const newArticle = insertResult[0];

    return NextResponse.json(successResponse(newArticle));
  } catch (error) {
    console.error('创建文章失败:', error);
    return NextResponse.json(
      errorResponse(`创建文章失败: ${error instanceof Error ? error.message : '未知错误'}`, 500),
      { status: 500 }
    );
  }
}
