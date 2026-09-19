import { groupPortfolioByCategory } from '@/lib/utils/portfolio'

const item = (title, category) => ({ title, category })

describe('groupPortfolioByCategory', () => {
  it('按 category 分组并统计数量（未配 order 时按数量倒序）', () => {
    const groups = groupPortfolioByCategory([
      item('a', 'DSH 插件'),
      item('b', 'DSH 插件'),
      item('c', '小程序')
    ])
    expect(groups.map(g => [g.name, g.items.length])).toEqual([
      ['DSH 插件', 2],
      ['小程序', 1]
    ])
  })

  it('order 中列出的分类按 order 顺序排在前面', () => {
    const groups = groupPortfolioByCategory(
      [
        item('a', '小程序'),
        item('b', 'DSH 插件'),
        item('c', '浏览器插件'),
        item('d', 'APP')
      ],
      { order: ['DSH 插件', '小程序', '浏览器插件', 'APP'] }
    )
    expect(groups.map(g => g.name)).toEqual([
      'DSH 插件',
      '小程序',
      '浏览器插件',
      'APP'
    ])
  })

  it('未列出的分类排在已列出分类之后，按数量倒序，未分类垫底', () => {
    const groups = groupPortfolioByCategory(
      [
        item('a', '小程序'),
        item('b', 'DSH 插件'),
        item('c', '网站'),
        item('d', '网站'),
        item('e', '网站'),
        item('f', 'AI 技能'),
        item('g', '')
      ],
      { order: ['DSH 插件', '小程序'] }
    )
    expect(groups.map(g => g.name)).toEqual([
      'DSH 插件',
      '小程序',
      '网站',
      'AI 技能',
      '其他'
    ])
  })

  it('category 为空/空白/缺失时归入 unclassified 并置底', () => {
    const groups = groupPortfolioByCategory(
      [
        item('a', '  '),
        item('b', undefined),
        { title: 'c' },
        item('d', '小程序')
      ],
      { unclassified: '未分类' }
    )
    const last = groups[groups.length - 1]
    expect(last.name).toBe('未分类')
    expect(last.items.map(i => i.title)).toEqual(['a', 'b', 'c'])
  })

  it('保留每组的原始作品顺序，并给出稳定 key', () => {
    const groups = groupPortfolioByCategory([
      item('a', 'DSH 插件'),
      item('b', 'DSH 插件')
    ])
    expect(groups[0].items.map(i => i.title)).toEqual(['a', 'b'])
    expect(groups[0].key).toBe('g0')
  })

  it('空输入返回空数组', () => {
    expect(groupPortfolioByCategory()).toEqual([])
    expect(groupPortfolioByCategory([])).toEqual([])
  })
})
