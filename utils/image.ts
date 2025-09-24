export const getStaticUrl = (path: string): string | null => {
  if (!path) return null;

  // 检查是否为外部链接（http/https开头）
  const isExternalUrl = path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:');

  if (isExternalUrl) {
    // 对于外部链接，直接返回原路径
    return path;
  }

  // 对于本地相对路径，添加base URL
  const base = process.env.NEXT_PUBLIC_STATIC_URL || 'http://127.0.0.1:8000';
  const cleanBase = (base || '').replace(/\/$/, '');
  const cleanPath = (path || '').replace(/^\/?static\//, '');

  return `${cleanBase}/${cleanPath}`;
};
  