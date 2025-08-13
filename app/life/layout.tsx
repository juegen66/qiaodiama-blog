import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 pt-16 w-full">
      <div className="container mx-auto px-4 w-full">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[200px]"><div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div></div>}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {children}
            </div>
            <div className="lg:col-span-4">
              {/* 生活页面需要显示全部分类与标签，因此传空白名单，且导航基准为 /life */}
              <Sidebar hideCategoryNames={[]} hideTagNames={[]} basePath="/life" />
            </div>
          </div>
        </Suspense>
      </div>
    </section>
  );
}
