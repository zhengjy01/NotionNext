import {
  pickRandomPost,
  pickRandomPostHref,
  resolvePostHref
} from '@/lib/utils/randomPost'

const post = (slug, href) => ({ slug, href, title: slug })

describe('resolvePostHref', () => {
  it('优先使用 NotionNext 算好的 href', () => {
    expect(resolvePostHref(post('a', '/a'))).toBe('/a')
  })

  it('没有 href 时用 slug 拼，并带上 SUB_PATH', () => {
    expect(resolvePostHref(post('a'), '/blog')).toBe('/blog/a')
    expect(resolvePostHref(post('a'), '/blog/')).toBe('/blog/a')
    expect(resolvePostHref(post('a'))).toBe('/a')
  })

  it('都没有时返回空串（调用方据此回首页）', () => {
    expect(resolvePostHref({})).toBe('')
    expect(resolvePostHref(null)).toBe('')
  })
})

describe('pickRandomPost', () => {
  const posts = [post('a', '/a'), post('b', '/b'), post('c', '/c')]

  it('空列表返回 null', () => {
    expect(pickRandomPost([])).toBeNull()
    expect(pickRandomPost(undefined)).toBeNull()
    expect(pickRandomPost([null, undefined])).toBeNull()
  })

  it('按注入的随机数取对应下标', () => {
    expect(pickRandomPost(posts, { random: () => 0 }).slug).toBe('a')
    expect(pickRandomPost(posts, { random: () => 0.5 }).slug).toBe('b')
    expect(pickRandomPost(posts, { random: () => 0.99 }).slug).toBe('c')
  })

  it('排除当前正在读的这篇', () => {
    // 排除 a 后池子里只剩 b、c（两篇），所以 0 → b、0.99 → c
    const targets = [0, 0.99].map(
      r => pickRandomPost(posts, { excludeHref: '/a', random: () => r }).slug
    )
    expect(targets).toEqual(['b', 'c'])
    expect(targets).not.toContain('a')
  })

  it('排除后一篇不剩时退化用全集（点了必须有反应）', () => {
    const only = [post('a', '/a')]
    const picked = pickRandomPost(only, { excludeHref: '/a', random: () => 0 })
    expect(picked.slug).toBe('a')
  })

  it('随机数异常（NaN / 1 / 负数）不会取到 undefined', () => {
    ;[NaN, 1, -1, Infinity].forEach(r => {
      const picked = pickRandomPost(posts, { random: () => r })
      expect(posts).toContain(picked)
    })
  })
})

describe('pickRandomPostHref', () => {
  it('返回可直接跳转的地址', () => {
    expect(
      pickRandomPostHref([post('a')], { subPath: '/blog', random: () => 0 })
    ).toBe('/blog/a')
  })

  it('没有文章时返回空串', () => {
    expect(pickRandomPostHref([], {})).toBe('')
  })
})
