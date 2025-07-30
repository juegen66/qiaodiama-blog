import { title, subtitle } from "@/components/primitives";
import { Link } from "@heroui/link";
import { GithubIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import Image from "next/image";

export default function About() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10 max-w-4xl mx-auto px-6">
      {/* 头部个人介绍 */}
      <div className="text-center">
        <h1 className={title({ color: "blue" })}>关于我</h1>
        <p className={subtitle({ class: "mt-4 md:w-full" })}>
          一名热爱编程与分享的大学生
        </p>
      </div>

      {/* 个人照片和简介 */}
      <div className="flex flex-col md:flex-row gap-8 items-center w-full">
        <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <Image
            src="/images/avatar.png"
            alt="头像"
            width={192}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">你好，我是juegen666</h2>
          <p className="text-default-600 mb-4">
            我是一名大三学生，目前就读于某大学。喜欢搞点技术
          </p>
          <p className="text-default-600">
            通过这个博客，我希望能记录自己的学习历程，分享技术心得，
            同时也会偶尔分享一些生活点滴和校园趣事。
          </p>
          <div className="flex gap-4 mt-6">
            <Link href={siteConfig.links.github} isExternal>
              <div className="mx-16 flex items-center gap-2">
                <GithubIcon className="text-default-500" />
                <span className="text-default-500">GitHub</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}

