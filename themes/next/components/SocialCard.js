import { useRef } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'
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

/**
 * 社交联系方式卡片（左侧栏独立展示，图标+名称列表，更醒目）
 * 已移除 RSS 图标；支持 GitHub/X/邮箱/小红书/即刻等
 * @returns {JSX.Element|null} 未配置任何社交渠道时返回 null
 */
const SocialCard = () => {
  const { locale } = useGlobal()
  const emailIcon = useRef(null)
  const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')

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
        <div className='flex items-center gap-2 pb-2 text-sm text-gray-600 dark:text-gray-300'>
          <i className='fas fa-address-book text-brand-600 dark:text-brand-400' />
          {locale?.CONTACT || '联系方式'}
        </div>
        <div className='grid grid-cols-1 gap-1'>
          {items.map(item => (
            <a
              key={item.name}
              {...(item.email
                ? {
                    onClick: e => handleEmailClick(e, emailIcon, CONTACT_EMAIL),
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
    </Card>
  )
}

export default SocialCard
