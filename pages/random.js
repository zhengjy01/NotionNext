import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { pickRandomPostHref } from '@/lib/utils/randomPost'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

/**
 * 「随机阅读」中转页
 *
 * 左侧菜单里那一项指向本页；进页后立刻按当前文章列表随机挑一篇跳走。
 * 之所以做成一个真实路由（而不是纯前端按钮）：
 * 1. 地址 /random 可直接收藏、分享，也能当浏览器主页用；
 * 2. 不依赖 JS 的点击处理，链接语义完整（Cmd+点击 / 新标签页都能用）；
 * 3. 菜单项在桌面左栏和移动端抽屉共用同一个组件，一处配置两端都有。
 *
 * 每次访问都重新随机（随机发生在浏览器里），所以刷新 /random 会换一篇。
 *
 * @param {*} props
 * @returns
 */
const RandomRedirect = props => {
  const router = useRouter()
  const posts = props?.posts || []
  const jumped = useRef(false)

  useEffect(() => {
    // 同一页面实例只跳一次，避免后续路由变化再次触发
    if (jumped.current) {
      return
    }
    jumped.current = true

    const subPath = siteConfig('SUB_PATH', '', props?.NOTION_CONFIG)
    // 排除当前正在读的这篇：在文章页点「随机阅读」不该又回到同一篇
    const current = (router.asPath || '').split(/[?#]/)[0]
    const href = pickRandomPostHref(posts, { excludeHref: current, subPath })

    router.replace(href || '/')
    // 故意只在挂载时跑一次：随机结果一旦跳走就不该跟着 props/router 变化重算
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] px-6 text-center'>
      <div className='font-serif text-lg text-gray-700 dark:text-gray-200'>
        {posts.length > 0 ? '正在为你随机挑一篇…' : '还没有文章'}
      </div>
      <div className='mt-2 text-sm font-light text-gray-400 dark:text-gray-500'>
        {posts.length > 0 ? '马上就好' : '正在返回首页'}
      </div>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'random', locale })

  // allNavPages 已由 SiteDataApi 过滤为「已发布的 Post 且 slug 非空」
  props.posts = props.allNavPages || []
  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default RandomRedirect
