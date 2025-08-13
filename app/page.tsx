"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Link } from "@heroui/link";
import { Image } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { HomeCarousel } from "@/components/home-carousel";
import { Sidebar } from "@/components/sidebar";
import { getPostList, Post } from "@/api/article";
import { getStaticUrl } from "@/utils/image";

const imageHeights = ["h-56", "h-72", "h-64", "h-80", "h-60"];
const rotations = ["rotate-0", "-rotate-1", "rotate-1", "-rotate-2", "rotate-2"];

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loadingLatest, setLoadingLatest] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getPostList({ page: 1, page_size: 8, status: 1 });
        if (isMounted && res && res.code === 200 && res.data) {
          // 只展示第3到第8条（索引2-7）
          setLatestPosts((res.data.items || []).slice(2, 8));
        }
      } catch (e) {
        // ignore
      } finally {
        if (isMounted) setLoadingLatest(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Suspense fallback={<div className="container mx-auto px-4 pt-1 pb-8"><div className="flex items-center justify-center min-h-[200px]"><div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div></div></div>}>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-1 pb-8">
      <div className="lg:col-span-8 flex flex-col items-center justify-center gap-0">
        <section className="w-full  mt-6">
          <HomeCarousel />
        </section>
        <section className="flex flex-col items-center justify-center gap-4 mt-[30px]">
          <p className={`${subtitle()} text-center`}>
            欢迎来到敲呆马的博客站
          </p>

          <div className="flex gap-3 mt-4">
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}
              href="/blog"
            >
              浏览文章
            </Link>
            <Link
              isExternal
              className={buttonStyles({ color: "primary", variant: "bordered", radius: "full" })}
              href={siteConfig.links.github}
            >
              <GithubIcon size={20} />
              GitHub
            </Link>
          </div>
        </section>

        {/* 最新文章 - Masonry 风格，带轻微旋转，打造“凌乱感” */}
        <section className="w-full mt-10">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-base font-semibold tracking-tight">最新文章</h2>
            <Link href="/blog" className="text-sm text-primary">更多 →</Link>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {latestPosts.map((post, idx) => (
              <Link
                key={post.id}
                href={`/blog?id=${post.id}`}
                className="group block mb-6 break-inside-avoid"
              >
                <div
                  className={clsx(
                    "relative overflow-hidden rounded-2xl border bg-white/60 dark:bg-white/5 border-zinc-200 dark:border-white/10",
                    "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/5",
                    rotations[idx % rotations.length]
                  )}
                >
                  {post.cover_image && (
                    <div className={clsx("w-full", imageHeights[idx % imageHeights.length])}>
                      <Image
                        removeWrapper
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        src={getStaticUrl(post.cover_image) || undefined}
                        alt={post.title}
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold tracking-tight">{post.title}</h3>
                    {post.summary && (
                      <p className="mt-1 text-sm text-default-500">{post.summary}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}

            {!loadingLatest && latestPosts.length === 0 && (
              <div className="text-default-500">暂无文章</div>
            )}
          </div>
        </section>
      </div>
      <div className="lg:col-span-4">
        <Sidebar />
      </div>
    </div>
    </Suspense>
  );
}
