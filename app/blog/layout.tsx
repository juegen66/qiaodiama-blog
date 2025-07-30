"use client"
import { Suspense } from "react";
import Loading from "../loding";
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 pt-16">
      <div className="w-full">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </div>
      
    </section>
  );
}
