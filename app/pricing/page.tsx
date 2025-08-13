"use client";
import { Image } from "@heroui/react";
import clsx from "clsx";
import { title, subtitle } from "@/components/primitives";
import { products } from "@/config/products";

const imageHeights = ["h-56", "h-72", "h-64", "h-80", "h-60"];
const rotations = ["rotate-0", "-rotate-1", "rotate-1", "-rotate-2", "rotate-2"];

export default function ProductsPage() {
  return (
    <div className="w-full relative">
      <div className="text-center mb-10">
        <h1 className={title({ className: "mb-3" })}>产品展示</h1>
        <p className={subtitle({ fullWidth: true })}>点击卡片直接访问对应站点</p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {products.map((product, idx) => (
          <a
            key={product.id}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block mb-6 break-inside-avoid"
          >
            <div
              className={clsx(
                "relative overflow-hidden rounded-2xl border bg-white/60 dark:bg-white/5 border-zinc-200 dark:border-white/10",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/5",
                rotations[idx % rotations.length]
              )}
            >
              <div className={clsx("w-full", imageHeights[idx % imageHeights.length])}>
                <Image
                  removeWrapper
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src={product.cover}
                  alt={product.name}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold tracking-tight">{product.name}</h3>
                <p className="mt-1 text-sm text-default-500">{product.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
