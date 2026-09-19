import { render, screen } from '@testing-library/react'
import RandomRedirect from '@/pages/random'

// 本用例只关心「进页后跳去哪」，数据获取（getStaticProps）另行保证
jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchGlobalAllData: jest.fn()
}))

jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback) => fallback
}))

const replace = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/random', replace })
}))

const posts = [
  { slug: 'a', href: '/a', title: 'A' },
  { slug: 'b', href: '/b', title: 'B' },
  { slug: 'c', href: '/c', title: 'C' }
]

describe('pages/random「随机阅读」中转页', () => {
  beforeEach(() => {
    replace.mockClear()
    jest.spyOn(Math, 'random').mockReturnValue(0)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('进页即跳走，replace 到随机文章地址（replace 不留返回记录）', () => {
    render(<RandomRedirect posts={posts} />)

    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/a')
  })

  it('只跳一次：后续重渲染不会再次触发', () => {
    const { rerender } = render(<RandomRedirect posts={posts} />)
    rerender(<RandomRedirect posts={posts} />)

    expect(replace).toHaveBeenCalledTimes(1)
  })

  it('没有文章时回首页，并给出提示', () => {
    render(<RandomRedirect posts={[]} />)

    expect(replace).toHaveBeenCalledWith('/')
    expect(screen.getByText('还没有文章')).toBeInTheDocument()
  })

  it('posts 缺失也不会崩（当作没有文章处理）', () => {
    render(<RandomRedirect />)

    expect(replace).toHaveBeenCalledWith('/')
  })
})
