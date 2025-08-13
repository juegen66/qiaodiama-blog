export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "首页",
      href: "/",
    },
    {
      label: "生活",
      href: "/life",
    },
    {
      label: "产品",
      href: "/pricing",
    },
    {
      label: "博客",
      href: "/blog",
    },
    {
      label: "关于",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "个人资料",
      href: "/profile",
    },
    {
      label: "仪表盘",
      href: "/dashboard",
    },
    {
      label: "项目",
      href: "/projects",
    },
    {
      label: "团队",
      href: "/team",
    },
    {
      label: "日历",
      href: "/calendar",
    },
    {
      label: "设置",
      href: "/settings",
    },
    {
      label: "帮助与反馈",
      href: "/help-feedback",
    },
    {
      label: "退出登录",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/juegen66",
    docs: "https://heroui.com",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
