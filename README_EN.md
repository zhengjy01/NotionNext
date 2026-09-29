# zhengjy.site

Source code of my personal blog — **https://www.zhengjy.site**

This repository is derived from [NotionNext](https://github.com/notionnext-org/NotionNext) v4.9.5
and is **independently maintained by me**. It does not track upstream releases; changes are made
only as this site needs them.

## Stack

- **Framework**: Next.js 14 (Pages Router)
- **Content**: Notion (pages are read through the Notion API)
- **Styling**: Tailwind CSS
- **Renderer**: react-notion-x
- **Deployment**: Vercel (pushes to `main` trigger a production build)
- **Theme**: `next`

## Development

```bash
yarn install
yarn dev          # http://localhost:3000
yarn build
yarn lint
yarn type-check
```

Site settings live in [`blog.config.js`](blog.config.js) and [`conf/`](conf/).
Notion-related settings are provided through environment variables (`.env.local` locally,
project environment variables on Vercel).

## License & credits

Released under the MIT License — see [LICENSE](LICENSE).

- Upstream: [NotionNext](https://github.com/notionnext-org/NotionNext) by tangly1024
- Earlier origin: [Nobelium](https://github.com/craigary/nobelium) by Craig Hart

The original copyright notice and license text are preserved in `LICENSE` as MIT requires.
