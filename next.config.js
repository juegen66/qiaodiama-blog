/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 忽略构建时的 ESLint 错误，避免非相关文件阻塞构建
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
