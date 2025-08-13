"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Pagination, Button } from "@heroui/react";
import { BlogPost } from "@/components/blog-post";
import { Sidebar } from "@/components/sidebar";
import { ArticlePage } from "@/components/article-page";
import { getPostList, Post } from "@/api/article";
import { useSearchParams, useRouter } from "next/navigation";

export default function App() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPostId, setSelectedPostId] = React.useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const tagId = searchParams.get('tag');
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const idParam = searchParams.get('id');
  const refreshKey = searchParams.get('_r');
  const queryKey = searchParams.toString();

  const selectedPost = selectedPostId 
    ? posts.find(post => post.id === selectedPostId)
    : null;

  const fetchPosts = async (
    page: number,
    args: { idParam?: string | null; tagId?: string | null; categoryId?: string | null; searchQuery?: string | null }
  ) => {
    try {
      setLoading(true);
      const response = await getPostList({
        id: args.idParam ? parseInt(args.idParam) : undefined,
        page,
        page_size: args.idParam ? 1 : pageSize,
        tag_id: args.tagId ? parseInt(args.tagId) : undefined,
        category_id: args.categoryId ? parseInt(args.categoryId) : undefined,
        search: args.searchQuery || undefined,
        // 博客页排除“生活”分类与“生活”标签的文章
        exclude_category_name: '生活',
        exclude_tag_name: '生活'
      });

      if (response && response.code === 200 && response.data) {
        setPosts(response.data.items);
        setTotalPages(response.data.total_pages);
        setTotalItems(response.data.total);
        if (args.idParam && response.data.items.length > 0) {
          setSelectedPostId(response.data.items[0].id);
        }
      } else {
        setPosts([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("获取文章列表失败:", error);
      setPosts([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const pageNum = parseInt(searchParams.get('page') || '1');
    setCurrentPage(pageNum);
  }, [searchParams]);

  useEffect(() => {
    const idNow = searchParams.get('id');
    const tagNow = searchParams.get('tag');
    const categoryNow = searchParams.get('category');
    const searchNow = searchParams.get('search');
    fetchPosts(currentPage, {
      idParam: idNow,
      tagId: tagNow,
      categoryId: categoryNow,
      searchQuery: searchNow
    });
  }, [currentPage, queryKey]);

  // 当筛选条件变化时，清空已选择的文章详情
  useEffect(() => {
    setSelectedPostId(null);
  }, [queryKey]);


  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/blog?${params.toString()}`);
    window.scrollTo(0, 0);
  };
    
  const handlePostSelect = (postId: number) => {
    setSelectedPostId(postId);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setSelectedPostId(null);
    window.scrollTo(0, 0);
  };

  const handleClearFilters = () => {
    router.push('/blog');
  };

  const handleResetPage = () => {
    setSelectedPostId(null);
    setCurrentPage(1);
    router.push(`/blog?_r=${Date.now()}`);
    window.scrollTo(0, 0);
  };

  const hasFilters = tagId || categoryId || searchQuery;

  return (
    <Suspense fallback={<div className="container mx-auto px-4 pt-1 pb-8"><div className="flex items-center justify-center min-h-[200px]"><div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div></div></div>}>
      <main className="container mx-auto px-4 pt-1 pb-8">
        <div className="flex justify-end mb-4">
          <Button size="sm" variant="flat" onClick={handleResetPage}>重置页面</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
              </div>
            ) : selectedPost ? (
              <ArticlePage article={selectedPost} onBack={handleBack} />
            ) : (
              <>
                {hasFilters && (
                  <div className="flex justify-between items-center bg-default-100 p-4 rounded-lg">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {searchQuery ? `搜索: "${searchQuery}"` : "筛选结果"}
                      </h3>
                      <p className="text-sm text-default-600">共找到 {totalItems} 篇文章</p>
                    </div>
                    <Button onClick={handleClearFilters} size="sm" variant="flat">
                      清除筛选
                    </Button>
                  </div>
                )}
                {posts.length > 0 ? (
                  <>
                    {posts.map((post) => (
                      <div key={post.id} onClick={() => handlePostSelect(post.id)} className="cursor-pointer">
                        <BlogPost post={post} />
                      </div>
                    ))}
                    <div className="flex justify-center mt-8">
                      {totalPages > 1 && (
                        <Pagination
                          total={totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          showControls
                          loop
                          isCompact
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-default-500">
                    {searchQuery ? `未找到关于 "${searchQuery}" 的文章` : "暂无文章"}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </main>
    </Suspense>
  );
}
