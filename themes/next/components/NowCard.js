import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Card from './Card'

/**
 * 「近况」卡片 —— **首页中间内容栏置顶**
 *
 * 名称说明（2026-09-19 改）：原名「最近在做什么」名不副实——三块内容里
 * 只有「在做」是进行时，状态句（今天完成了什么）与最近产出（已发布）都是已发生的事。
 * 「近况」同时覆盖两者。
 *
 * 数据**全部来自 Notion**（`type=Now / status=Published` 的那条页面），经
 * `lib/db/SiteDataApi.js` 的 `getNowData()` 解析后作为 `now` prop 传进来：
 *   - status  ← 页面 title（可直接在 Notion 里改）
 *   - doing[] / recent[] ← summary 属性里的 JSON
 *
 * 页面走 60s ISR，本机脚本 `~/dsh-blog-sync/sync_now.mjs` 写完 Notion
 * **最多一分钟就生效，不需要提交 git、也不需要重新部署**。
 *
 * 为什么放中间栏而不是侧栏：侧栏只有 240px，标题必然被截断；中间栏有 ~896px
 * （`lg:max-w-3xl xl:max-w-4xl`），能完整显示，做成左右两栏后仍很紧凑。
 * 中间栏在移动端同样可见，所以手机用户也能看到这张卡。
 *
 * 结构：{ status, doing:[{title}], recent:[{kind,title,date,href,source}], updatedAtLabel }
 *
 * `recent[]` 的 `source`（`notion` / `github` / `npm` / `obsidian`）由本机脚本
 * `~/dsh-blog-sync/sync_now.mjs` 写入；老数据没有这个字段时按 `kind` 反推（见 `resolveSource`）。
 */

const pad = n => String(n).padStart(2, '0')

/**
 * 兜底格式化：**必须显式锁 Asia/Shanghai**
 * —— 页面在 Vercel(UTC) 构建/重新验证时跑，用本地时区会让所有人看到 UTC 时间
 *（实测曾显示 09-19 01:44，差 8 小时）。
 * 正常情况下直接用 Notion 里由本机脚本（+08:00）预格式化好的 updatedAtLabel。
 */
function formatUpdated(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  try {
    const parts = new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(d)
    const get = t => parts.find(p => p.type === t)?.value ?? ''
    return `${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`
  } catch {
    const shifted = new Date(d.getTime() + 8 * 3600 * 1000)
    return `${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())} ${pad(
      shifted.getUTCHours()
    )}:${pad(shifted.getUTCMinutes())}`
  }
}

/** 2026-09-18 → "09-18" */
function formatDay(day) {
  if (!day) return ''
  return day.slice(5)
}

/**
 * 来源标识（2026-09-27 加）
 *
 * 「最近产出」从「只有 Notion Post/Portfolio」改成**跨渠道全局聚合**后
 * （Notion 文章/作品集 · GitHub Release/PR/新仓库 · npm 发版 · 本机项目档案），
 * 不标来源访客分不清哪条是什么。
 *
 * 用 **12px 单色描边图标**（与右侧外链箭头同一套笔触、同样的 `opacity-25 → hover` 节奏），
 * 具体来源名走 `<title>` 原生提示，不占版面。**刻意不用 emoji**（站点审美硬约束）。
 */
const SOURCE_META = {
  github: {
    label: kind =>
      ({
        release: 'GitHub Release',
        repo: 'GitHub 新仓库',
        pr: 'GitHub Pull Request'
      })[kind] || 'GitHub',
    // git 分支：主干 + 分叉 + 两个节点
    path: 'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM9 6h6a3 3 0 0 1 3 3v2'
  },
  npm: {
    label: () => 'npm 发布',
    // 立方体（package）
    path: 'M21 16V8l-9-5-9 5v8l9 5 9-5ZM3.3 8.2 12 13l8.7-4.8M12 13v8'
  },
  notion: {
    label: kind => (kind === 'project' ? '作品集' : '博客文章'),
    // 文档：矩形 + 折角 + 两行文字
    path: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M9 13h6M9 17h4'
  },
  obsidian: {
    label: () => '本机项目档案',
    // 终端窗口
    path: 'M4 7l4 5-4 5M12 17h8'
  }
}

/** 老数据兜底：本次改造前写进 Notion 的 summary 没有 `source`，按 `kind` 反推 */
function resolveSource(item) {
  if (item?.source && SOURCE_META[item.source]) return item.source
  const k = item?.kind
  if (k === 'release' || k === 'repo' || k === 'pr') return 'github'
  if (k === 'npm') return 'npm'
  if (k === 'local') return 'obsidian'
  return 'notion'
}

/** 来源小图标（纯装饰性尺寸，来源名由内部 `<title>` 提供原生提示） */
const SourceIcon = ({ item }) => {
  const meta = SOURCE_META[resolveSource(item)]
  return (
    <svg
      viewBox='0 0 24 24'
      className='mt-[5px] h-3 w-3 shrink-0 stroke-current opacity-25 transition-opacity group-hover:opacity-60'
      fill='none'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <title>{meta.label(item?.kind)}</title>
      <path d={meta.path} />
    </svg>
  )
}

/** 分组小标题：极窄字距 + 中性灰，避免抢正文 */
const SectionLabel = ({ children, first }) => (
  <div
    className={`pb-2 text-[11px] font-medium tracking-[0.14em] text-gray-400 dark:text-gray-500 ${
      first ? '' : 'pt-4'
    }`}>
    {children}
  </div>
)

const NowCard = ({ now }) => {
  if (!siteConfig('NEXT_HOME_NOW', true, CONFIG)) return null

  const doing = now?.doing ?? []
  const recent = now?.recent ?? []
  if (!now?.status && doing.length === 0 && recent.length === 0) return null

  return (
    <Card className='mt-2 mb-4'>
      <div className='px-4 py-2 sm:px-6'>
        {/* 头部：品牌色小圆点 + 衬线标题 + 更新时间 */}
        <div className='flex items-center gap-2 pb-3'>
          <span className='flex h-[7px] w-[7px] shrink-0 items-center justify-center rounded-full bg-brand-500/90 ring-2 ring-brand-500/15 dark:bg-brand-400/90 dark:ring-brand-400/15' />
          <h3 className='flex-1 truncate font-serif text-sm tracking-wide text-gray-800 dark:text-gray-100'>
            近况
          </h3>
          <span
            title='数据更新时间（北京时间）'
            className='shrink-0 text-[11px] tabular-nums text-gray-400 dark:text-gray-500'>
            {now.updatedAtLabel || formatUpdated(now.updatedAt)}
          </span>
        </div>

        {/* 状态句 */}
        {now.status && (
          <p className='pb-5 text-[15px] leading-[1.75] text-gray-700 dark:text-gray-200'>
            {now.status}
          </p>
        )}

        {/* 在做 / 最近产出：宽屏左右两栏，窄屏上下堆叠 */}
        <div className='grid gap-x-10 gap-y-1 sm:grid-cols-2'>
          {doing.length > 0 && (
            <div>
              <SectionLabel first>在做</SectionLabel>
              <ul className='space-y-1.5'>
                {doing.map((item, i) => (
                  <li
                    key={i}
                    title={item.title}
                    className='flex gap-2 text-[13px] leading-[1.7] text-gray-500 dark:text-gray-400'>
                    <span className='mt-[8px] h-[3px] w-[3px] shrink-0 rounded-full bg-gray-300 dark:bg-gray-600' />
                    <span className='line-clamp-2'>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recent.length > 0 && (
            <div>
              <SectionLabel first={doing.length === 0}>最近产出</SectionLabel>
              <ul className='space-y-1.5'>
                {recent.map((item, i) => {
                  const external = /^https?:/.test(item.href || '')
                  const row = (
                    <>
                      <span className='flex min-w-0 flex-1 items-start gap-1.5 text-[13px] leading-[1.7] text-gray-600 dark:text-gray-300'>
                        <SourceIcon item={item} />
                        <span className='line-clamp-2 transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400'>
                          {item.title}
                        </span>
                        {external && (
                          <svg
                            viewBox='0 0 24 24'
                            className='mt-[5px] h-3 w-3 shrink-0 stroke-current opacity-25 transition-opacity group-hover:opacity-70'
                            fill='none'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            aria-hidden='true'>
                            <path d='M7 17 17 7M9 7h8v8' />
                          </svg>
                        )}
                      </span>
                      <span className='ml-3 shrink-0 pt-[1px] text-[11px] tabular-nums text-gray-400 dark:text-gray-500'>
                        {formatDay(item.date)}
                      </span>
                    </>
                  )
                  return item.href ? (
                    <li key={i}>
                      <SmartLink
                        href={item.href}
                        title={item.title}
                        className='group flex items-start justify-between'>
                        {row}
                      </SmartLink>
                    </li>
                  ) : (
                    <li
                      key={i}
                      className='group flex items-start justify-between'>
                      {row}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default NowCard
