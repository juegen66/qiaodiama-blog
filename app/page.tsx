import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <section className="flex flex-col items-center justify-center gap-4 mt-24">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title({ color: "blue" })}>欢迎来到&nbsp;</span>
          <span className={title({ color: "blue" })}>juegen66&nbsp;</span>
          <br />
          <span className={title({ color: "blue" })}>
            的博客
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            苦逼大学生分享技术心得，记录学习历程，偶尔分享生活点滴
          </div>
        </div>

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
    </div>
  );
}
