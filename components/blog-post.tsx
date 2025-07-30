import React, { useEffect } from "react";
import { Card, CardBody, Link, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Post } from "@/api/article";
import { getStaticUrl } from "@/utils/image";
interface BlogPostProps {
  post: Post;
}

export const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  
  useEffect(() => {
    console.log(getStaticUrl(post.cover_image));
  }, [post.cover_image]);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow" shadow="sm">
      <CardBody className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 sm:h-auto sm:w-1/3">
            <Image
              removeWrapper
              className="object-cover w-full h-full"
              src={getStaticUrl(post.cover_image) || undefined}
              alt={post.title}
            />
          </div>
          <div className="p-5 sm:w-2/3">
            <div className="flex items-center gap-3 text-small text-default-500 mb-2">
              <div className="flex items-center gap-1">
                <Icon icon="lucide:calendar" className="text-base" />
                <span>{formattedDate}</span>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-2">
              <Link 
                href={`/post/${post.id}`}
                color="foreground"
                className="hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </h2>
            
            <p className="text-default-500 mb-4">
              {post.summary}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};