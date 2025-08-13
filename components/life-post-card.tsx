import React from "react";
import { Card, CardBody, Image } from "@heroui/react";
import { Post } from "@/api/article";
import { getStaticUrl } from "@/utils/image";

interface LifePostCardProps {
  post: Post;
}

export const LifePostCard: React.FC<LifePostCardProps> = ({ post }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card shadow="sm" className="overflow-hidden group bg-content1 border border-default-200">
      <CardBody className="p-0">
        {post.cover_image && (
          <div className="relative">
            <Image
              removeWrapper
              className="object-cover w-full h-auto max-h-[360px]"
              src={getStaticUrl(post.cover_image) || undefined}
              alt={post.title}
            />
          </div>
        )}

        <div className="p-5">
          <div className="text-xs text-default-500 mb-2">{formattedDate}</div>
          <h3 className="text-base sm:text-lg font-medium leading-snug tracking-tight">
            {post.title}
          </h3>
          {post.summary && (
            <p className="text-default-500 text-sm mt-2 line-clamp-3">
              {post.summary}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};


