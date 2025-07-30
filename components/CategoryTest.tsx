"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { apiFetch } from "@/api/fetch";
import { getCategoryList, createCategory, Category } from "@/api/article";
import { ApiResponse } from "@/api/response";

export default function CategoryTest() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async (useDirect = false) => {
    setLoading(true);
    setError(null);

    try {
      let response: ApiResponse<Category[]> | undefined;

      if (useDirect) {
        // 直接调用API端点
        response = await apiFetch<Category[]>('/api/categories');
      } else {
        // 使用封装的API函数
        response = await getCategoryList();
      }

      if (response && response.code === 200 && response.data) {
        setCategories(response.data);
        console.log('获取分类成功:', response.data);
      } else {
        setError(response?.message || '获取分类失败');
      }
    } catch (err) {
      setError('网络请求失败');
      console.error('获取分类失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTestCategory = async (useDirect = false) => {
    setLoading(true);
    setError(null);

    try {
      const testCategory = {
        name: `测试分类_${Date.now()}`,
        description: '这是一个测试分类'
      };

      let response: ApiResponse<Category> | undefined;

      if (useDirect) {
        // 直接调用API端点
        response = await apiFetch<Category>('/api/categories', {
          method: 'POST',
          body: testCategory
        });
      } else {
        // 使用封装的API函数
        response = await createCategory(testCategory);
      }

      if (response && response.code === 200) {
        console.log('创建分类成功:', response.data);
        // 创建成功后重新获取分类列表
        await fetchCategories(useDirect);
      } else {
        setError(response?.message || '创建分类失败');
      }
    } catch (err) {
      setError('创建分类失败');
      console.error('创建分类失败:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md font-semibold">分类管理测试</p>
            <p className="text-small text-default-500">测试分类API功能</p>
          </div>
        </CardHeader>
        <Divider/>
        <CardBody>
          <div className="flex gap-3 mb-4">
            <Button
              color="primary"
              onPress={() => fetchCategories(false)}
              isLoading={loading}
            >
              获取所有分类 (封装函数)
            </Button>
            <Button
              color="success"
              variant="bordered"
              onPress={() => fetchCategories(true)}
              isLoading={loading}
            >
              获取所有分类 (直接调用)
            </Button>
            <Button
              color="secondary"
              variant="bordered"
              onPress={() => createTestCategory(false)}
              isLoading={loading}
            >
              创建测试分类 (封装函数)
            </Button>
            <Button
              color="warning"
              variant="bordered"
              onPress={() => createTestCategory(true)}
              isLoading={loading}
            >
              创建测试分类 (直接调用)
            </Button>
          </div>

          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {categories.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">分类列表 ({categories.length}个)</h3>
              <div className="grid gap-3">
                {categories.map((category) => (
                  <Card key={category.id} className="bg-default-50">
                    <CardBody className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{category.name}</h4>
                          {category.description && (
                            <p className="text-default-600 mt-1">{category.description}</p>
                          )}
                          <div className="flex gap-4 mt-2 text-small text-default-500">
                            <span>ID: {category.id}</span>
                            <span>文章数: {category._count?.posts || 0}</span>
                            <span>创建时间: {category.createTime ? new Date(category.createTime).toLocaleString() : '未知'}</span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!loading && categories.length === 0 && !error && (
            <div className="text-center text-default-500 py-8">
              暂无分类数据，点击"获取所有分类"按钮开始测试
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
