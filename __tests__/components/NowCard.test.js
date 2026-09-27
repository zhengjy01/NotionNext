import { render, screen } from '@testing-library/react'
import NowCard from '@/themes/next/components/NowCard'

// 组件读站点配置（开关 NEXT_HOME_NOW）与 locale，这里给最小可用假数据
jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback) => fallback
}))

// SmartLink 依赖 next/link 与站点配置，测试里降级成普通 <a>
jest.mock('@/components/SmartLink', () => {
  const React = require('react')
  return function MockSmartLink({ href, children, ...rest }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }
})

/**
 * 「最近产出」自 2026-09-27 起是跨渠道聚合（Notion / GitHub / npm / 本机档案），
 * 每条按 `source` 渲染一个来源图标；来源名走 SVG `<title>` 原生提示。
 */
const NOW = {
  status: '把「最近产出」改成全局产出聚合',
  updatedAtLabel: '09-27 11:35',
  doing: [{ title: '迁移存量留痕任务' }],
  recent: [
    {
      kind: 'release',
      title: 'dsh-task-dispatcher v0.6.0',
      date: '2026-09-27',
      href: 'https://github.com/zhengjy01/dsh-task-dispatcher/releases/tag/v0.6.0',
      source: 'github'
    },
    {
      kind: 'npm',
      title: 'dsh-skill-studio 0.2.2',
      date: '2026-09-27',
      href: 'https://www.npmjs.com/package/dsh-skill-studio',
      source: 'npm'
    },
    {
      kind: 'post',
      title: '让 AI 记住上一个会话做过什么',
      date: '2026-09-27',
      href: '/DSH/3e81d09e0449818dbed0f4635463c66a',
      source: 'notion'
    },
    {
      kind: 'project',
      title: 'dsh-restart',
      date: '2026-09-12',
      href: 'https://github.com/zhengjy01/dsh-restart',
      source: 'notion'
    },
    {
      kind: 'local',
      title: '佳明数据本地同步',
      date: '2026-09-27',
      href: null,
      source: 'obsidian'
    }
  ]
}

describe('themes/next NowCard 来源标识', () => {
  it('按 source 渲染四类来源图标，且来源名进 title 提示', () => {
    render(<NowCard now={NOW} />)

    expect(screen.getByTitle('GitHub Release')).toBeInTheDocument()
    expect(screen.getByTitle('npm 发布')).toBeInTheDocument()
    expect(screen.getByTitle('博客文章')).toBeInTheDocument()
    expect(screen.getByTitle('作品集')).toBeInTheDocument()
    expect(screen.getByTitle('本机项目档案')).toBeInTheDocument()
  })

  it('老数据没有 source 字段时按 kind 反推来源（改造前写进 Notion 的 summary）', () => {
    render(
      <NowCard
        now={{
          ...NOW,
          recent: [
            {
              kind: 'release',
              title: '旧版发版记录',
              date: '2026-09-01',
              href: 'https://x.test'
            },
            {
              kind: 'npm',
              title: '旧版 npm 记录',
              date: '2026-09-01',
              href: 'https://x.test'
            },
            {
              kind: 'local',
              title: '旧版本机记录',
              date: '2026-09-01',
              href: null
            },
            {
              kind: 'post',
              title: '旧版文章记录',
              date: '2026-09-01',
              href: '/x'
            }
          ]
        }}
      />
    )

    expect(screen.getByTitle('GitHub Release')).toBeInTheDocument()
    expect(screen.getByTitle('npm 发布')).toBeInTheDocument()
    expect(screen.getByTitle('本机项目档案')).toBeInTheDocument()
    expect(screen.getByTitle('博客文章')).toBeInTheDocument()
  })

  it('外链标外链箭头、站内不标；两条都带日期', () => {
    render(<NowCard now={NOW} />)

    const external = screen.getByTitle('dsh-task-dispatcher v0.6.0')
    expect(external).toHaveAttribute(
      'href',
      'https://github.com/zhengjy01/dsh-task-dispatcher/releases/tag/v0.6.0'
    )
    // 外链箭头：与来源图标同样 12px，但路径不同（来源图标 → 箭头）
    expect(external.querySelectorAll('svg').length).toBe(2)

    const internal = screen.getByTitle('让 AI 记住上一个会话做过什么')
    expect(internal.querySelectorAll('svg').length).toBe(1)
    expect(screen.getByText('09-12')).toBeInTheDocument()
  })

  it('现在空的 doing / recent 与缺 now 时不渲染卡片', () => {
    const { container } = render(<NowCard now={null} />)
    expect(container).toBeEmptyDOMElement()

    const { container: onlyDoing } = render(
      <NowCard now={{ doing: [], recent: [] }} />
    )
    expect(onlyDoing).toBeEmptyDOMElement()
  })
})
