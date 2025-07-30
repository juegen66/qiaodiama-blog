# 📦 PostgreSQL 数据库表结构文档

## 🔸category - 文章分类表


| 字段名      | 类型        | 默认值                     | 备注             |
| ----------- | ----------- | -------------------------- | ---------------- |
| create_time | timestamptz | CURRENT_TIMESTAMP          | 创建时间         |
| update_time | timestamptz | CURRENT_TIMESTAMP          | 更新时间         |
| id          | int4        | nextval('category_id_seq') | 主键             |
| name        | varchar(50) | 无                         | 分类名称（唯一） |
| description | text        | 无                         | 分类描述         |

---

## 🔸operation_log - 操作日志表


| 字段名      | 类型         | 默认值                          | 备注             |
| ----------- | ------------ | ------------------------------- | ---------------- |
| create_time | timestamptz  | CURRENT_TIMESTAMP               | 创建时间         |
| update_time | timestamptz  | CURRENT_TIMESTAMP               | 更新时间         |
| id          | int4         | nextval('operation_log_id_seq') | 主键             |
| username    | varchar(50)  | 无                              | 用户名           |
| operation   | varchar(255) | 无                              | 操作内容         |
| result      | varchar(255) | 无                              | 操作结果         |
| user_id     | int4         | 无                              | 外键 -> user(id) |

---

## 🔸post - 博客文章表


| 字段名      | 类型         | 默认值                 | 备注                 |
| ----------- | ------------ | ---------------------- | -------------------- |
| create_time | timestamptz  | CURRENT_TIMESTAMP      | 创建时间             |
| update_time | timestamptz  | CURRENT_TIMESTAMP      | 更新时间             |
| id          | int4         | nextval('post_id_seq') | 主键                 |
| title       | varchar(255) | 无                     | 文章标题             |
| content     | text         | 无                     | 文章内容             |
| summary     | varchar(512) | 无                     | 文章摘要             |
| cover_image | varchar(255) | 无                     | 封面图 URL           |
| status      | int4         | 1                      | 状态（1发布，0草稿） |
| views       | int4         | 0                      | 浏览次数             |
| category_id | int4         | 无                     | 外键 -> category(id) |
| user_id     | int4         | 无                     | 外键 -> user(id)     |

---

## 🔸post_tag - 文章与标签中间表（多对多）


| 字段名  | 类型 | 说明             |
| ------- | ---- | ---------------- |
| post_id | int4 | 外键 -> post(id) |
| tag_id  | int4 | 外键 -> tag(id)  |

> 唯一约束: (post_id, tag_id)

---

## 🔸tag - 标签表


| 字段名      | 类型        | 默认值                | 备注             |
| ----------- | ----------- | --------------------- | ---------------- |
| create_time | timestamptz | CURRENT_TIMESTAMP     | 创建时间         |
| update_time | timestamptz | CURRENT_TIMESTAMP     | 更新时间         |
| id          | int4        | nextval('tag_id_seq') | 主键             |
| name        | varchar(30) | 无                    | 标签名称（唯一） |
| description | text        | 无                    | 标签描述         |

---

## 🔸test_table1 - 测试表


| 字段名      | 类型         | 默认值                        | 备注     |
| ----------- | ------------ | ----------------------------- | -------- |
| id          | int4         | nextval('test_table1_id_seq') | 主键     |
| name        | varchar(255) | 无                            | 名称     |
| description | text         | 无                            | 描述     |
| created_at  | timestamptz  | CURRENT_TIMESTAMP             | 创建时间 |
| updated_at  | timestamptz  | CURRENT_TIMESTAMP             | 更新时间 |

---

## 🔸user - 用户表


| 字段名      | 类型         | 默认值  我            | 备注                              |
| ----------- | ------------ | ---------------------- | --------------------------------- |
| create_time | timestamptz  | CURRENT_TIMESTAMP      | 创建时间                          |
| update_time | timestamptz  | CURRENT_TIMESTAMP      | 更新时间                          |
| id          | int4         | nextval('user_id_seq') | 主键                              |
| username    | varchar(20)  | 无                     | 用户名（唯一）                    |
| password    | varchar(255) | 无                     | 密码哈希                          |
| nickname    | varchar(20)  | 无                     | 昵称                              |
| user_type   | int4         | 2                      | 用户类型（0超管，1管理员，2普通） |
| user_email  | varchar(255) | 无                     | 邮箱（唯一）                      |
| user_status | int4         | 1                      | 状态（0未激活，1正常，2禁用）     |
| user_phone  | varchar(11)  | 无                     | 手机号（唯一）                    |
| login_time  | timestamptz  | 无                     | 最后登录时间                      |
| avatar      | varchar(255) | 无                     | 头像URL                           |
| sex         | int4         | 无                     | 性别（1男，2女，0未知）           |
| remarks     | varchar(255) | 无                     | 备注                              |
| client_host | varchar(45)  | 无                     | 最后登录 IP                       |

> ## 🔸 system_log - 系统日志表
>
>
> | 字段名      | 类型         | 默认值                       | 备注                             |
> | ----------- | ------------ | ---------------------------- | -------------------------------- |
> | id          | int4         | nextval('system_log_id_seq') | 主键，自增                       |
> | create_time | timestamptz  | CURRENT_TIMESTAMP            | 创建时间                         |
> | update_time | timestamptz  | CURRENT_TIMESTAMP            | 更新时间                         |
> | log_level   | varchar(20)  | 无                           | 日志等级（如 INFO、WARN、ERROR） |
> | source      | varchar(100) | 无                           | 日志来源模块或服务名             |
> | message     | text         | 无                           | 日志详细信息                     |
> | user_id     | int4         | NULL                         | 操作用户ID，关联 user 表         |
> | ip_address  | varchar(45)  | NULL                         | 操作来源 IP 地址                 |
> | remarks     | varchar(255) | NULL                         | 备注或扩展信息                   |
>
> ### 约束
>
> - 主键：`id`
> - 外键：`user_id` 关联 `user` 表的 `id`，删除用户时对应日志的 `user_id` 设为 NULL
>
> ---
>
> 如果你需要，我可以帮你生成完整的 Markdown 文件或者更多字段说明。
