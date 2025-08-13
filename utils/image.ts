export const getStaticUrl = (path: string): string | null => {
  if (!path) return null;
  
  const base = process.env.NEXT_PUBLIC_STATIC_URL || 'http://127.0.0.1:8000';
  const cleanBase = (base || '').replace(/\/$/, '');
  const cleanPath = (path || '').replace(/^\/?static\//, '');
  
  return `${cleanBase}/${cleanPath}`;
};
  