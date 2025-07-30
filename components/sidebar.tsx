import React, { useEffect, useState } from "react";
import { Card, CardBody, Link, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { getTagSimpleList, getCategoryList, Tag, Category } from "../api/article";

const socialLinks = [
  { icon: "logos:github-icon", label: "GitHub", url: "https://github.com/juegen666" },
];

export const Sidebar = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTagSimpleList();
        const responseData = response as any;
        if (responseData && responseData.code === 200) {
          setTags(responseData.data);
        }
      } catch (error) {
        console.error("获取标签列表失败:", error);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoryList();
        if (response && response.code === 200 && response.data) {
          // 转换数据格式以兼容旧的接口
          const categoriesData = response.data.map(cat => ({
            id: cat.id,
            name: cat.name,
            article_count: cat._count?.posts || 0
          }));
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("获取分类列表失败:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {/* Author Card */}
      <Card shadow="sm">
        <CardBody className="text-center">
          <Avatar
           src="/images/avatar.png"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">Juegen66</h3>
          <p className="text-default-500 text-sm mb-4">
            牛马大学生 
          </p>
          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.url}
                className="text-default-500 hover:text-primary transition-colors"
              >
                <Icon icon={link.icon} className="text-2xl" />
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Categories */}
      <Card shadow="sm">
        <CardBody>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {loadingCategories ? (
              <p className="text-default-500 text-sm">加载中...</p>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between group"
                >
                  <Link
                    href={`/blog?category=${category.id}`}
                    color="foreground"
                    className="hover:text-primary transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                  <span className="text-default-500 text-xs">
                    {category.article_count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-default-500 text-sm">暂无分类</p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Tags */}
      <Card shadow="sm">
        <CardBody>
          <h3 className="text-lg font-semibold mb-4">Tag</h3>
          <div className="flex flex-wrap gap-2">
            {loadingTags ? (
              <p className="text-default-500 text-sm">加载中...</p>
            ) : tags.length > 0 ? (
              tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.id}`}
                  className="flex items-center gap-1 px-3 py-1 border border-default-200 rounded-full bg-default-50 hover:bg-primary/10 hover:border-primary text-xs font-medium text-default-700 hover:text-primary transition-colors shadow-sm"
                  style={{ lineHeight: '1.8' }}
                >
                  <Icon icon="mdi:tag-outline" className="text-base opacity-70" />
                  {tag.name}
                  <span className="ml-1 text-default-400">({tag.article_count})</span>
                </Link>
              ))
            ) : (
              <p className="text-default-500 text-sm">暂无标签</p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};