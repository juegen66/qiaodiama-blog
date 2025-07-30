"use client";
import { useState } from "react";
import { title } from "@/components/primitives";
import { Card, Button } from "@heroui/react";

// 文章类型定义
interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
}

// 模拟文章数据
const articles: Article[] = [
  {
    id: 1,
    title: "React 入门教程",
    content: "这是一篇关于 React 基础的文章...",
    summary: "学习 React 的基础知识"
  },
  {
    id: 2,
    title: "TypeScript 实战",
    content: "TypeScript 让你的代码更安全...",
    summary: "深入理解 TypeScript"
  },
  {
    id: 3,
    title: "Next.js 13 新特性",
    content: "App Router 带来了全新的开发体验...",
    summary: "探索 Next.js 13 的新功能"
  }
];

// 组件 Props 类型定义
interface ArticleListProps {
  onArticleClick: (id: number) => void;
}

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

// 文章列表组件
const ArticleList = ({ onArticleClick }: ArticleListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">文章列表</h2>
      {articles.map((article) => (
        <Card 
          key={article.id}
          className="p-4 cursor-pointer hover:bg-gray-100"
          onClick={() => onArticleClick(article.id)}
        >
          <h3 className="font-semibold">{article.title}</h3>
          <p className="text-gray-600">{article.summary}</p>
        </Card>
      ))}
    </div>
  );
};

// 文章详情组件
const ArticleDetail = ({ article, onBack }: ArticleDetailProps) => {
  if (!article) return null;

  return (
    <div className="space-y-4">
      <Button 
        color="primary" 
        variant="light"
        onClick={onBack}
      >
        返回列表
      </Button>
      <h2 className="text-2xl font-bold">{article.title}</h2>
      <p className="text-gray-700">{article.content}</p>
    </div>
  );
};

export default function PricingPage() {
  // 状态：当前选中的文章ID
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  // 根据ID查找文章
  const selectedArticle = selectedArticleId 
    ? articles.find(article => article.id === selectedArticleId)
    : null;

  // 处理文章点击
  const handleArticleClick = (articleId: number) => {
    console.log('点击了文章:', articleId);
    setSelectedArticleId(articleId);
  };

  // 处理返回列表
  const handleBack = () => {
    setSelectedArticleId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className={title({ className: "mb-8" })}>文章列表与详情演示</h1>
      
      {/* 根据是否选中文章来决定显示列表还是详情 */}
      {selectedArticle ? (
        <ArticleDetail 
          article={selectedArticle} 
          onBack={handleBack}
        />
      ) : (
        <ArticleList 
          onArticleClick={handleArticleClick}
        />
      )}

      {/* 调试信息 */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">调试信息：</h3>
        <p>当前选中的文章ID: {selectedArticleId || '无'}</p>
        <p>是否找到对应文章: {selectedArticle ? '是' : '否'}</p>
      </div>
    </div>
  );
}
