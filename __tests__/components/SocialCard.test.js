import { fireEvent, render, screen } from '@testing-library/react'
import SocialCard from '@/themes/next/components/SocialCard'

// 组件依赖全局 locale 与站点配置，这里给出最小可用的假数据
jest.mock('@/lib/global', () => ({
  useGlobal: () => ({ locale: { CONTACT: '联系方式' } })
}))

jest.mock('@/lib/plugins/mailEncrypt', () => ({
  handleEmailClick: jest.fn()
}))

jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback) => {
    const values = {
      CONTACT_GITHUB: 'https://github.com/zhengjy01',
      CONTACT_TWITTER: 'https://x.com/zhengjunyaocn',
      CONTACT_XIAOHONGSHU: 'https://www.xiaohongshu.com/user/profile/5fccc738',
      CONTACT_JIKE: 'https://okjk.co/kVcj6W',
      NEXT_LEFT_CONTACT_OPEN: false
    }
    return key in values ? values[key] : fallback
  }
}))

const STORAGE_KEY = 'dsh:next:contact-open'

describe('themes/next SocialCard 联系方式折叠', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('默认收起：aria-expanded=false，面板 aria-hidden=true', () => {
    render(<SocialCard />)

    const toggle = screen.getByRole('button', { name: /联系方式/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'contact-panel')

    const panel = document.getElementById('contact-panel')
    expect(panel).not.toBeNull()
    expect(panel).toHaveAttribute('aria-hidden', 'true')
    expect(panel.className).toContain('grid-rows-[0fr]')
  })

  it('点击标题展开：aria-expanded=true、加 inert 取消、写入本地记忆', () => {
    render(<SocialCard />)
    const toggle = screen.getByRole('button', { name: /联系方式/ })

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const panel = document.getElementById('contact-panel')
    expect(panel).toHaveAttribute('aria-hidden', 'false')
    expect(panel.className).toContain('grid-rows-[1fr]')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('1')
  })

  it('再点一次收起：回到 0fr 并把选择记成 0', () => {
    render(<SocialCard />)
    const toggle = screen.getByRole('button', { name: /联系方式/ })

    fireEvent.click(toggle)
    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('0')
  })

  it('下次访问跟随本地记忆：存过 1 则首屏就是展开', () => {
    window.localStorage.setItem(STORAGE_KEY, '1')
    render(<SocialCard />)

    expect(screen.getByRole('button', { name: /联系方式/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  it('渠道链接仍完整渲染在面板里', () => {
    render(<SocialCard />)
    const panel = document.getElementById('contact-panel')

    expect(panel.querySelectorAll('a')).toHaveLength(4)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('小红书')).toBeInTheDocument()
    expect(screen.getByText('即刻')).toBeInTheDocument()
  })
})
