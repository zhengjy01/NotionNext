# 郑俊耀的博客 · zhengjy.site

个人博客站点的源代码。线上地址：**https://www.zhengjy.site**

本仓库由 [NotionNext](https://github.com/notionnext-org/NotionNext) v4.9.5 派生而来，
是**我个人独立维护的版本**：不跟随上游更新，改动按自己的需要来，不追求与上游兼容。

## 技术栈

- **框架**：Next.js 14（Pages Router）
- **内容源**：Notion（页面数据经 Notion API 读取，改内容不用动代码）
- **样式**：Tailwind CSS
- **渲染**：react-notion-x
- **部署**：Vercel（push 到 `main` 自动构建发布）
- **当前主题**：`next`

## 相对上游做过的主要定制

- 全站设计改版：品牌色（墨蓝 `#3E5C9A`）、衬线标题搭配无衬线正文、去装饰降噪
- 左侧栏「联系方式」卡片支持折叠（默认收起、记住选择）
- 首页中部新增「近况」卡片，数据源为 Notion 中 `type=Now` 的页面（更新内容无需重新部署）
- 作品集（Portfolio）按 Notion 分类折叠展示
- 左栏新增「随机阅读」入口
- 页脚邮件订阅（Mailchimp）
- 文章列表关闭内联预览、显示摘要；移除文章卡片底部的「文章详情」按钮
- 移除页脚 Powered by 版权行
- 全仓 Prettier 格式化基线

## 本地开发

```bash
yarn install
yarn dev          # http://localhost:3000
yarn build        # 生产构建
yarn lint         # ESLint
yarn type-check   # TypeScript 类型检查
yarn format       # Prettier 格式化
```

站点配置集中在 [`blog.config.js`](blog.config.js) 与 [`conf/`](conf/)：
站点名称、作者、`LINK`（站点地址）、导航菜单、联系方式、统计分析、评论开关等。

Notion 相关配置走环境变量——本地写在 `.env.local`，线上配在 Vercel 的项目环境变量里：

| 变量                           | 说明                              |
| ------------------------------ | --------------------------------- |
| `NOTION_PAGE_ID`               | 博客根页面 ID（必填）             |
| `NEXT_PUBLIC_MAILCHIMP_ENABLED` | 邮件订阅开关                     |
| `MAILCHIMP_API_KEY`            | Mailchimp API Key                 |
| `MAILCHIMP_LIST_ID`            | Mailchimp 受众列表 ID             |

> 完整变量清单可参考上游文档：https://docs.tangly1024.com/

## 部署

推送到 `origin/main` 即触发 Vercel 生产部署。

仓库内原有的 `Upstream Sync` 工作流已移除——本仓库不跟随上游更新。

## 许可与致谢

本项目按 MIT 许可发布，见 [LICENSE](LICENSE)。

- 上游项目：[NotionNext](https://github.com/notionnext-org/NotionNext)（原作者 tangly1024）
- 更早的源头：[Nobelium](https://github.com/craigary/nobelium)（Craig Hart）

按 MIT 许可要求，原项目的版权声明与许可条款完整保留在 `LICENSE` 中。
