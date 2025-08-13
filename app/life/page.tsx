"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Pagination } from "@heroui/react";
import { getPostList, Post } from "@/api/article";
import { ArticlePage } from "@/components/article-page";
import { LifePostCard } from "@/components/life-post-card";
import { useSearchParams, useRouter } from "next/navigation";

export default function LifePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const pageSize = 12;
  const queryKey = searchParams.toString();

  const selectedPost = selectedPostId
    ? posts.find(post => post.id === selectedPostId)
    : null;

  const fetchLifePosts = async (
    page: number,
    args: { tagId?: string | null; categoryId?: string | null } = {}
  ) => {
    try {
      setLoading(true);
      const tagNow = args.tagId ?? searchParams.get("tag");
      const categoryNow = args.categoryId ?? searchParams.get("category");
      const response = await getPostList({
        page,
        page_size: pageSize,
        category_name: "生活",
        tag_id: tagNow ? parseInt(tagNow) : undefined,
        category_id: categoryNow ? parseInt(categoryNow) : undefined,
      });

      if (response && response.code === 200 && response.data) {
        setPosts(response.data.items);
        setTotalPages(response.data.total_pages);
      } else {
        setPosts([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('获取生活文章失败:', err);
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pageNum = parseInt(searchParams.get('page') || '1');
    setCurrentPage(pageNum);
  }, [queryKey]);

  useEffect(() => {
    const tagNow = searchParams.get('tag');
    const categoryNow = searchParams.get('category');
    fetchLifePosts(currentPage, { tagId: tagNow, categoryId: categoryNow });
  }, [currentPage, queryKey]);

  useEffect(() => {
    setSelectedPostId(null);
  }, [queryKey]);

  const handlePageChange = (page: number) => {
    setSelectedPostId(null);
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/life?${params.toString()}`);
    window.scrollTo(0, 0);
  };

  return (
    <Suspense fallback={<div className="container mx-auto px-4 pt-1 pb-8"><div className="flex items-center justify-center min-h-[200px]"><div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-default-400"></div></div></div>}>
      <main className="container mx-auto px-4 pt-10 pb-12">
        <section className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Life / 生活</h1>
          <p className="text-default-500 mt-2 text-sm">记录生活片段与灵感，简洁雅致。</p>
        </section>

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-default-400"></div>
          </div>
        ) : selectedPost ? (
          <ArticlePage article={selectedPost} onBack={() => setSelectedPostId(null)} />
        ) : (
          <>
            {/* Masonry columns for a staggered, airy layout */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]"></div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
              {posts.map((post) => (
                <div key={post.id} className="break-inside-avoid mb-6 cursor-pointer" onClick={() => setSelectedPostId(post.id)}>
                  <LifePostCard post={post} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  showControls
                  loop
                  isCompact
                />
              </div>
            )}
          </>
        )}
      </main>
    </Suspense>
  );
}

