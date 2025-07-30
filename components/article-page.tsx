import React, { useRef, useEffect } from "react";
import { Card, CardBody, Image, Link, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Post } from "@/api/article";
import { getStaticUrl } from "@/utils/image";

interface ArticleProps {
  article: Post;
  onBack: () => void;
}

export const ArticlePage: React.FC<ArticleProps> = ({ article, onBack }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const formattedDate = new Date(article.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  useEffect(() => {
    if (contentRef.current) {
      // 检查是否已经有shadow root
      if (!contentRef.current.shadowRoot) {
        // 如果没有，创建新的shadow root
        const shadowRoot = contentRef.current.attachShadow({ mode: 'open' });
        
        // 创建样式元素
        const style = document.createElement('style');
        style.textContent = `
          :host {
            display: block;
            color: inherit;
            font-family: inherit;
          }
          p { margin-bottom: 1rem; }
          img { max-width: 100%; height: auto; }
          h1, h2, h3, h4, h5, h6 { margin: 1.5rem 0 1rem; }
          a { color: #006FEE; text-decoration: none; }
          a:hover { text-decoration: underline; }
          pre { 
            background: #f4f4f4;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
          }
          code {
            background: #f4f4f4;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
          }
        `;
        
        // 创建内容容器
        const container = document.createElement('div');
        container.innerHTML = article.content;
        
        // 添加样式和内容到shadow root
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(container);
      } else {
        // 如果已经有shadow root，只更新内容
        const container = contentRef.current.shadowRoot.querySelector('div');
        if (container) {
          container.innerHTML = article.content;
        }
      }
    }
  }, [article.content]);

  return (
    <Card shadow="sm" className="overflow-hidden">
      <CardBody className="p-0">
        <div className="relative h-64 sm:h-80">
          <Image
            removeWrapper
            className="object-cover w-full h-full"
            src={getStaticUrl(article.cover_image) || undefined}
            alt={article.title}
          />
        </div>
        <div className="p-6">
          <Button 
            variant="light" 
            color="primary" 
            startContent={<Icon icon="lucide:arrow-left" />}
            onPress={onBack}
            className="mb-4"
          >
            返回列表
          </Button>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">{article.title}</h1>
          
          <div className="flex flex-wrap items-center gap-3 text-small text-default-500 mb-6">
            <div className="flex items-center gap-1">
              <Icon icon="lucide:calendar" className="text-base" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div ref={contentRef} className="prose max-w-none"></div>
          
          <div className="mt-8 pt-6 border-t border-default-200">
            <h3 className="text-lg font-semibold mb-4">分享文章</h3>
            <div className="flex gap-3">
              <Link href="#" className="text-default-500 hover:text-primary transition-colors">
                <Icon icon="logos:twitter" className="text-xl" />
              </Link>
              <Link href="#" className="text-default-500 hover:text-primary transition-colors">
                <Icon icon="logos:facebook" className="text-xl" />
              </Link>
              <Link href="#" className="text-default-500 hover:text-primary transition-colors">
                <Icon icon="logos:linkedin-icon" className="text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};