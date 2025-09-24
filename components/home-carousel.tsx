"use client";

import React, { useEffect, useState } from "react";
import { Image, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";
import { getPostList, Post } from "@/api/article";
import { getStaticUrl } from "@/utils/image";
import { useRouter } from "next/navigation";

interface CarouselItem extends Post {}

export const HomeCarousel: React.FC = () => {
  const router = useRouter();
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      setLoading(true);
      try {
        const res = await getPostList({ page: 1, page_size: 5, status: 1 });
        if (res && res.code === 200 && res.data) {
          setItems(res.data.items);
        } else {
          setItems([]);
        }
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((idx) => (idx + 1) % items.length);
      setImageLoaded(false); // 重置图片加载状态
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const goPrev = () => {
    setActiveIndex((idx) => (idx - 1 + items.length) % items.length);
    setImageLoaded(false);
  };

  const goNext = () => {
    setActiveIndex((idx) => (idx + 1) % items.length);
    setImageLoaded(false);
  };

  const handleClick = (postId: number) => {
    router.push(`/blog?id=${postId}`);
  };

  if (loading) {
    return (
      <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (items.length === 0) return null;

  const current = items[activeIndex];

  return (
    <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden group">
      <button
        aria-label="Previous"
        onClick={goPrev}
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
      >
        <Icon icon="lucide:chevron-left" />
      </button>
      <button
        aria-label="Next"
        onClick={goNext}
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
      >
        <Icon icon="lucide:chevron-right" />
      </button>

      <button
        type="button"
        aria-label={`打开文章：${current.title}`}
        onClick={() => handleClick(current.id)}
        className="absolute inset-0 cursor-pointer text-left"
      >
        <Image
          removeWrapper
          className="object-cover w-full h-full"
          src={getStaticUrl(current.cover_image) || undefined}
          alt={current.title}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
          <h3 className="text-white text-lg sm:text-2xl font-semibold line-clamp-2">
            {current.title}
          </h3>
          {current.summary && (
            <p className="text-white/90 text-sm sm:text-base mt-1 line-clamp-2">
              {current.summary}
            </p>
          )}
        </div>
      </button>

      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 w-2 rounded-full ${idx === activeIndex ? "bg-white" : "bg-white/50"}`}
          />)
        )}
      </div>
    </div>
  );
};


