"use client";

import React, { useEffect, useState } from "react";
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

  const selectedPost = selectedPostId 
    ? posts.find(post => post.id === selectedPostId)
    : null;

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true);
      const response = await getPostList({
        page,
        page_size: pageSize,
        tag_id: tagId ? parseInt(tagId) : undefined,
        category_id: categoryId ? parseInt(categoryId) : undefined,
        search: searchQuery || undefined
      });

      if (response && response.code === 200 && response.data) {
        setPosts(response.data.items);
        setTotalPages(response.data.total_pages);
        setTotalItems(response.data.total);
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
    fetchPosts(currentPage);
  }, [currentPage, tagId, categoryId, searchQuery]);


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

  const hasFilters = tagId || categoryId || searchQuery;

  return (
    <main className="container mx-auto px-4 pt-1 pb-8">
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
  );
}
