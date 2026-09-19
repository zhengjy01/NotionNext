import { render, screen } from '@testing-library/react'
import { MenuList } from '@/themes/next/components/MenuList'

// 站点配置：本用例只关心「随机阅读」这一项，其余开关给个明确值便于断言
let siteConfigValues = {}
jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback) => {
    return key in siteConfigValues ? siteConfigValues[key] : fallback
  }
}))

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    locale: {
      NAV: {
        INDEX: '首页',
        ARCHIVE: '归档',
        PORTFOLIO: '作品集',
        RANDOM: '随机阅读'
      },
      COMMON: { CATEGORY: '分类', TAGS: '标签' }
    }
  })
}))

// Notion 自定义菜单（线上就是这一种：CUSTOM_MENU 开启后覆盖默认菜单）
const customMenu = [
  {
    id: 1,
    icon: 'fas fa-clock-rotate-left',
    name: '归档',
    href: '/archive',
    show: true
  },
  { id: 2, icon: 'fas fa-th', name: '分类', href: '/category', show: true }
]

const renderMenu = (props = {}) => render(<MenuList {...props} />)

// 桌面端菜单项是 <li><a>，移动端抽屉是 <div><a>，所以统一取 a
const navLinks = id =>
  [...document.getElementById(id).querySelectorAll('a')].map(a => ({
    text: a.textContent.trim(),
    href: a.getAttribute('href')
  }))

describe('themes/next MenuList「随机阅读」入口', () => {
  beforeEach(() => {
    siteConfigValues = {
      CUSTOM_MENU: false,
      NEXT_MENU_RANDOM: true,
      NEXT_MENU_CATEGORY: true,
      NEXT_MENU_TAG: true,
      NEXT_MENU_ARCHIVE: true,
      NEXT_MENU_PORTFOLIO: true
    }
  })

  it('默认菜单里「随机阅读」排在最前，指向 /random', () => {
    renderMenu()

    const desktop = navLinks('nav')
    expect(desktop[0]).toEqual({ text: '随机阅读', href: '/random' })
  })

  it('桌面左栏与移动端抽屉共用同一份菜单，两端都有', () => {
    renderMenu()

    expect(navLinks('nav')[0].text).toBe('随机阅读')
    expect(navLinks('nav-menu-mobile')[0].text).toBe('随机阅读')
  })

  it('CUSTOM_MENU 开启时不会被 Notion 自定义菜单覆盖掉，且仍在最前', () => {
    siteConfigValues.CUSTOM_MENU = true
    renderMenu({ customMenu })

    const desktop = navLinks('nav')
    expect(desktop.map(l => l.text)).toEqual(['随机阅读', '归档', '分类'])
    expect(desktop[0].href).toBe('/random')
  })

  it('NEXT_MENU_RANDOM 关闭时不渲染', () => {
    siteConfigValues.NEXT_MENU_RANDOM = false
    renderMenu()

    expect(screen.queryByText('随机阅读')).toBeNull()
  })

  it('自定义菜单为空且随机关闭时，菜单整体不渲染（保持原有行为）', () => {
    siteConfigValues.CUSTOM_MENU = true
    siteConfigValues.NEXT_MENU_RANDOM = false
    renderMenu({ customMenu: [] })

    expect(document.getElementById('nav')).toBeNull()
  })
})
