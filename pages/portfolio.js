import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'

/**
 * 作品集页面：展示 Notion 数据库中 type=Portfolio 且已发布的记录
 * 每条作品包含：名称(title)、简介(summary)、网址链接(url)
 * @param {*} props
 * @returns
 */
const Portfolio = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPortfolio' {...props} />
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'portfolio-index', locale })

  // 作品集数据已由 SiteDataApi 组装，这里兜底保证字段完整
  props.portfolio = (props.portfolio || []).map(item => ({
    id: item.id,
    title: item.title || '未命名作品',
    summary: item.summary || '',
    url: item.url || '',
    slug: item.slug || '',
    category: item.category || '',
    tags: item.tags || [],
    date: item.date || null,
    publishDate: item.publishDate || 0,
    publishDay: item.publishDay || '',
    pageCover: item.pageCover || '',
    pageCoverThumbnail: item.pageCoverThumbnail || '',
    pageIcon: item.pageIcon || ''
  }))

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

export default Portfolio
