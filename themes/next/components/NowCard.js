import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Card from './Card'
import nowData from '@/data/now.json'

/**
 * 「最近在做什么」卡片（左侧栏）
 *
 * 数据来自仓库里的 data/now.json —— 由本机脚本 ~/dsh-blog-sync/build_now.mjs 聚合生成：
 *   滴答清单「In progress」→ doing[]；Notion 库最新 Post / Portfolio → recent[]；
 *   Obsidian 日报「今日主线」→ status。
 * 脚本 push 到 main 后 Vercel 自动重建，卡片随构建一起静态渲染（无客户端请求、无水合闪烁）。
 *
 * 字段：{ updatedAt, status, doing: [{title}], recent: [{kind,title,date,href}] }
 */

const pad = n => String(n).padStart(2, '0')

/** 2026-09-19T09:29:00+08:00 → "09-19 09:29"（按访问者本地时区） */
function formatUpdated(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 2026-09-18 → "09-18" */
function formatDay(day) {
  if (!day) return ''
  return day.slice(5)
}

/** 分组小标题：极窄字距 + 中性灰，避免抢正文 */
const SectionLabel = ({ children, first }) => (
  <div
    className={`pb-1.5 text-[11px] font-medium tracking-[0.14em] text-gray-400 dark:text-gray-500 ${
      first ? '' : 'pt-3'
    }`}
  >
    {children}
  </div>
)

const NowCard = () => {
  if (!siteConfig('NEXT_LEFT_NOW', true, CONFIG)) return null

  const doing = nowData?.doing ?? []
  const recent = nowData?.recent ?? []
  if (!nowData?.status && doing.length === 0 && recent.length === 0) return null

  return (
    <Card className='mb-2'>
      <div className='px-3 py-1'>
        {/* 标题：品牌色小圆点 + 衬线标题，表达「此刻」 */}
        <div className='flex items-center gap-2 pb-2.5'>
          <span className='flex h-[7px] w-[7px] shrink-0 items-center justify-center rounded-full bg-brand-500/90 ring-2 ring-brand-500/15 dark:bg-brand-400/90 dark:ring-brand-400/15' />
          <h3 className='flex-1 truncate font-serif text-sm tracking-wide text-gray-800 dark:text-gray-100'>
            最近在做什么
          </h3>
          <span
            title='数据更新时间'
            className='shrink-0 text-[10.5px] tabular-nums text-gray-400 dark:text-gray-500'
          >
            {formatUpdated(nowData.updatedAt)}
          </span>
        </div>

        {/* 状态句 */}
        {nowData.status && (
          <p className='pb-3 text-[13px] leading-[1.7] text-gray-600 dark:text-gray-300'>
            {nowData.status}
          </p>
        )}

        {/* 在做 */}
        {doing.length > 0 && (
          <div>
            <SectionLabel first>在做</SectionLabel>
            <ul className='space-y-1.5'>
              {doing.map((item, i) => (
                <li
                  key={i}
                  title={item.title}
                  className='flex gap-2 text-[12.5px] leading-[1.6] text-gray-500 dark:text-gray-400'
                >
                  <span className='mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-gray-300 dark:bg-gray-600' />
                  <span className='line-clamp-1'>{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 最近产出：文章（站内）与作品集（外链）合流，按时间倒序 */}
        {recent.length > 0 && (
          <div>
            <SectionLabel first={doing.length === 0}>最近产出</SectionLabel>
            <ul className='space-y-1.5'>
              {recent.map((item, i) => {
                const external = /^https?:/.test(item.href || '')
                const row = (
                  <>
                    <span className='flex min-w-0 flex-1 items-center gap-1 text-[12.5px] text-gray-600 dark:text-gray-300'>
                      <span className='line-clamp-1 transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400'>
                        {item.title}
                      </span>
                      {external && (
                        <svg
                          viewBox='0 0 24 24'
                          className='h-3 w-3 shrink-0 stroke-current opacity-25 transition-opacity group-hover:opacity-70'
                          fill='none'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          aria-hidden='true'
                        >
                          <path d='M7 17 17 7M9 7h8v8' />
                        </svg>
                      )}
                    </span>
                    <span className='ml-2 shrink-0 text-[10.5px] tabular-nums text-gray-400 dark:text-gray-500'>
                      {formatDay(item.date)}
                    </span>
                  </>
                )
                return item.href ? (
                  <li key={i}>
                    <SmartLink
                      href={item.href}
                      title={item.title}
                      className='group flex items-center justify-between'
                    >
                      {row}
                    </SmartLink>
                  </li>
                ) : (
                  <li key={i} className='group flex items-center justify-between'>
                    {row}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}

export default NowCard
