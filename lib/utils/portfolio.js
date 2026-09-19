/**
 * 作品集分类相关工具（纯函数，便于单测）
 * 分类数据源 = 每条作品的 category 字段（Notion 里改，不用改代码）
 */

/**
 * 按 category 把作品集记录分组
 *
 * 排序规则：
 * 1. options.order 里列出的分类，按列出的先后顺序
 * 2. 其余分类按作品数量从多到少，数量相同按名称排序
 * 3. 未分类（category 为空）固定排在最后
 *
 * @param {Array} items 作品集记录
 * @param {{order?: string[], unclassified?: string}} options
 * @returns {Array<{key: string, name: string, items: Array}>}
 */
export function groupPortfolioByCategory(items, options = {}) {
  const list = Array.isArray(items) ? items : []
  const order = Array.isArray(options.order) ? options.order : []
  const unclassified = options.unclassified || '其他'

  const buckets = new Map()
  list.forEach(item => {
    const name = (item?.category || '').toString().trim() || unclassified
    if (!buckets.has(name)) {
      buckets.set(name, [])
    }
    buckets.get(name).push(item)
  })

  const rankOf = name => {
    if (name === unclassified) {
      return Number.MAX_SAFE_INTEGER
    }
    const index = order.indexOf(name)
    return index === -1 ? order.length : index
  }

  return [...buckets.entries()]
    .map(([name, groupItems]) => ({ name, items: groupItems }))
    .sort((a, b) => {
      const rankDiff = rankOf(a.name) - rankOf(b.name)
      if (rankDiff !== 0) {
        return rankDiff
      }
      if (b.items.length !== a.items.length) {
        return b.items.length - a.items.length
      }
      return a.name.localeCompare(b.name, 'zh-Hans-CN')
    })
    .map((group, index) => ({ ...group, key: `g${index}` }))
}
