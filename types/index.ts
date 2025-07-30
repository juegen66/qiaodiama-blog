import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// 系统日志相关类型定义
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface SystemLog {
  id: number;
  create_time: Date;
  update_time: Date;
  log_level: LogLevel;
  source: string;
  message: string;
  user_id?: number | null;
  ip_address?: string | null;
  remarks?: string | null;
}

export interface SystemLogData {
  log_level: LogLevel;
  source: string;
  message: string;
  user_id?: number | null;
  ip_address?: string | null;
  remarks?: string | null;
}

// 用户相关类型定义
export interface User {
  id: number;
  username: string;
  nickname?: string;
  user_type: number; // 0超管，1管理员，2普通
  user_email?: string;
  user_status: number; // 0未激活，1正常，2禁用
  user_phone?: string;
  login_time?: Date;
  avatar?: string;
  sex?: number; // 1男，2女，0未知
  remarks?: string;
  client_host?: string;
  create_time: Date;
  update_time: Date;
}

// 文章相关类型定义
export interface Post {
  id: number;
  title: string;
  content: string;
  summary?: string;
  cover_image?: string;
  status: number; // 1发布，0草稿
  views: number;
  category_id?: number;
  user_id: number;
  create_time: Date;
  update_time: Date;
}

// 分类相关类型定义
export interface Category {
  id: number;
  name: string;
  description?: string;
  create_time: Date;
  update_time: Date;
}

// 标签相关类型定义
export interface Tag {
  id: number;
  name: string;
  description?: string;
  create_time: Date;
  update_time: Date;
}
