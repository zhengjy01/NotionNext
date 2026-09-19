import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'
import CONFIG from '../config'
import Card from './Card'

// 单色 SVG 图标（无品牌字体的平台，与 X logo 风格统一）
const XhsIcon = (
  <svg
    viewBox='0 0 24 24'
    className='inline-block h-4 w-4 fill-current'
    aria-hidden='true'
  >
    <path d='M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm2 3h10v1.5H7V8zm0 3.5h10V13H7v-1.5zm0 3.5h7V16H7v-1z' />
  </svg>
)

const JikeIcon = (
  <svg
    viewBox='0 0 24 24'
    className='inline-block h-4 w-4 fill-current'
    aria-hidden='true'
  >
    <path d='M13 2 3 14h7l-1 8 10-12h-7l1-8z' />
  </svg>
)

// 用户折叠选择记在浏览器本地：跨页面导航、下次访问都保持
const STORAGE_KEY = 'dsh:next:contact-open'
const PANEL_ID = 'contact-panel'

/**
 * 社交联系方式卡片（左侧栏独立展示，图标+名称列表，更醒目）
 * 标题行可点击折叠/展开；面板保留在 DOM 里（利于 SEO），收起时用 grid-rows + inert
 * 隐藏且不参与键盘焦点。初始展开状态见 CONFIG.NEXT_LEFT_CONTACT_OPEN。
 * 已移除 RSS 图标；支持 GitHub/X/邮箱/小红书/即刻等
 * @returns {JSX.Element|null} 未配置任何社交渠道时返回 null
 */
const SocialCard = () => {
  const { locale } = useGlobal()
  const emailIcon = useRef(null)
  const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')
  const [open, setOpen] = useState(
    !!siteConfig('NEXT_LEFT_CONTACT_OPEN', false, CONFIG)
  )

  // SSG 首屏按配置渲染，水合后再跟随浏览器记住的状态（避免服务端/客户端不一致）
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === '1' || saved === '0') {
        setOpen(saved === '1')
      }
    } catch {
      /* 隐私模式等禁用 localStorage 时忽略，退回配置默认值 */
    }
  }, [])

  const toggle = () => {
    const next = !open
    setOpen(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
    } catch {
      /* 隐私模式等禁用 localStorage 时忽略 */
    }
  }

  // 数据驱动：仅渲染已配置的渠道；icon 可为 FA class 或 SVG 节点
  const items = []
  const push = (icon, name, href, extra = {}) => {
    items.push({ icon, name, href, ...extra })
  }

  siteConfig('CONTACT_GITHUB') &&
    push('fab fa-github', 'GitHub', siteConfig('CONTACT_GITHUB'))
  siteConfig('CONTACT_TWITTER') &&
    push('', 'X', siteConfig('CONTACT_TWITTER'), { xLogo: true })
  siteConfig('CONTACT_TELEGRAM') &&
    push('fab fa-telegram', 'Telegram', siteConfig('CONTACT_TELEGRAM'))
  siteConfig('CONTACT_LINKEDIN') &&
    push('fab fa-linkedin', 'LinkedIn', siteConfig('CONTACT_LINKEDIN'))
  siteConfig('CONTACT_WEIBO') &&
    push('fab fa-weibo', '微博', siteConfig('CONTACT_WEIBO'))
  siteConfig('CONTACT_INSTAGRAM') &&
    push('fab fa-instagram', 'Instagram', siteConfig('CONTACT_INSTAGRAM'))
  siteConfig('CONTACT_BILIBILI') &&
    push('fab fa-bilibili', 'Bilibili', siteConfig('CONTACT_BILIBILI'))
  siteConfig('CONTACT_YOUTUBE') &&
    push('fab fa-youtube', 'YouTube', siteConfig('CONTACT_YOUTUBE'))
  siteConfig('CONTACT_XIAOHONGSHU') &&
    push(XhsIcon, '小红书', siteConfig('CONTACT_XIAOHONGSHU'), {
      node: true
    })
  siteConfig('CONTACT_JIKE') &&
    push(JikeIcon, '即刻', siteConfig('CONTACT_JIKE'), { node: true })
  siteConfig('CONTACT_ZHISHIXINGQIU') &&
    push(
      'fas fa-graduation-cap',
      '知识星球',
      siteConfig('CONTACT_ZHISHIXINGQIU')
    )
  CONTACT_EMAIL && push('fas fa-envelope', 'Email', null, { email: true })

  if (items.length === 0) {
    return null
  }

  return (
    <Card className='mb-2 -mt-2'>
      <div className='p-3'>
        <button
          type='button'
          onClick={toggle}
          aria-expanded={open}
          aria-controls={PANEL_ID}
          title={open ? '收起联系方式' : '展开联系方式'}
          className='group flex w-full cursor-pointer items-center gap-2 text-sm text-gray-600 transition-colors duration-200 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400'
        >
          <i className='fas fa-address-book text-brand-600 dark:text-brand-400' />
          <span className='flex-1 text-left'>
            {locale?.CONTACT || '联系方式'}
          </span>
          <svg
            viewBox='0 0 24 24'
            aria-hidden='true'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${
              open
                ? 'rotate-180 text-brand-500 dark:text-brand-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <path d='M6 9l6 6 6-6' />
          </svg>
        </button>

        {/* 面板留在 DOM（利于 SEO），收起时 grid-rows 0fr + inert 隐藏 */}
        <div
          id={PANEL_ID}
          inert={open ? undefined : ''}
          aria-hidden={!open}
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className='overflow-hidden'>
            <div className='grid grid-cols-1 gap-1 pt-1.5'>
              {items.map(item => (
                <a
                  key={item.name}
                  {...(item.email
                    ? {
                        onClick: e =>
                          handleEmailClick(e, emailIcon, CONTACT_EMAIL),
                        ref: emailIcon,
                        className: 'cursor-pointer'
                      }
                    : { target: '_blank', rel: 'noreferrer', href: item.href })}
                  className='flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-600 dark:hover:text-brand-400 transition duration-150'
                >
                  <span className='w-5 text-center text-lg leading-none'>
                    {item.xLogo ? (
                      <svg
                        viewBox='0 0 24 24'
                        className='inline-block h-4 w-4 fill-current'
                        aria-hidden='true'
                      >
                        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                      </svg>
                    ) : item.node ? (
                      item.icon
                    ) : (
                      <i className={item.icon} />
                    )}
                  </span>
                  <span className='text-sm'>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default SocialCard
