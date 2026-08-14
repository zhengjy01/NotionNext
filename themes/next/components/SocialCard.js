import { useRef } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'
import Card from './Card'

/**
 * 社交联系方式卡片（左侧栏独立展示，图标+名称列表，更醒目）
 * 已移除 RSS 图标；支持 GitHub/X/邮箱/小红书/即刻等
 * @returns {JSX.Element|null} 未配置任何社交渠道时返回 null
 */
const SocialCard = () => {
  const { locale } = useGlobal()
  const emailIcon = useRef(null)
  const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')

  // 数据驱动：仅渲染已配置的渠道；emoji 项用于无品牌图标的平台
  const items = []
  const push = (icon, name, href, extra = {}) => {
    items.push({ icon, name, href, ...extra })
  }

  siteConfig('CONTACT_GITHUB') &&
    push('fab fa-github', 'GitHub', siteConfig('CONTACT_GITHUB'))
  siteConfig('CONTACT_TWITTER') &&
    push('fab fa-twitter', 'X', siteConfig('CONTACT_TWITTER'))
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
    push('📕', '小红书', siteConfig('CONTACT_XIAOHONGSHU'), { emoji: true })
  siteConfig('CONTACT_JIKE') &&
    push('⚡', '即刻', siteConfig('CONTACT_JIKE'), { emoji: true })
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
          <i className='fas fa-address-book text-blue-600 dark:text-blue-400' />
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
              className='flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition duration-150'
            >
              <span className='w-5 text-center text-lg leading-none'>
                {item.emoji ? item.icon : <i className={item.icon} />}
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
