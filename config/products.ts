export type ProductStatus = "stable" | "beta" | "wip";

export interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  cover?: string;
  logo?: string;
  tags?: string[];
  status?: ProductStatus;
}

export const products: Product[] = [
  {
    id: "markdown-saas",
    name: "Markdown 笔记 SaaS",
    description: "云端 Markdown 编辑与多端同步，支持一键发布到博客与知识库。",
    url: "https://example.com/markdown",
    cover: "https://picsum.photos/seed/markdown/1200/800",
    tags: ["Markdown", "SaaS", "同步"],
    status: "beta",
  },
  {
    id: "img-compressor",
    name: "图片压缩工具",
    description: "本地/批量压缩与格式转换，智能不损质压缩，适合前端与运营。",
    url: "https://example.com/img-compressor",
    cover: "https://picsum.photos/seed/compress/1200/800",
    tags: ["图片", "压缩", "转换"],
    status: "stable",
  },
  {
    id: "blog-starter",
    name: "博客引擎模板",
    description: "基于 Next.js + HeroUI 的极简博客模板，开箱即用，支持暗黑模式与标签分类。",
    url: "https://example.com/blog-starter",
    cover: "https://picsum.photos/seed/blog/1200/800",
    tags: ["Next.js", "模板", "博客"],
    status: "stable",
  },
  {
    id: "ai-prompt-kit",
    name: "AI Prompt 套件",
    description: "常用提示词合集与工作流，覆盖文案、代码与产品设计场景。",
    url: "https://example.com/ai-prompt-kit",
    cover: "https://picsum.photos/seed/prompt/1200/800",
    tags: ["AI", "Prompt", "效率"],
    status: "beta",
  },
  {
    id: "weekly-generator",
    name: "周报生成器",
    description: "从提交记录/任务清单自动生成本周工作周报，一键复制发送。",
    url: "https://example.com/weekly",
    cover: "https://picsum.photos/seed/weekly/1200/800",
    tags: ["自动化", "效率"],
    status: "wip",
  },
  {
    id: "cover-maker",
    name: "封面图生成器",
    description: "快速生成社媒与博客封面图，内置多套排版与字体主题。",
    url: "https://example.com/cover-maker",
    cover: "https://picsum.photos/seed/cover/1200/800",
    tags: ["设计", "图片", "封面"],
    status: "beta",
  },
];


