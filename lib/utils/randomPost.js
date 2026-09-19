/**
 * 「随机阅读」相关工具（纯函数，便于单测）
 *
 * 数据源 = 站点已发布的文章列表（NotionNext 的 allNavPages：
 * 只含 type=Post 且 status=Published 的记录，slug 已过滤为非空），
 * 所以这里只需要处理「挑哪一篇」和「跳到哪个地址」两件事。
 */

/**
 * 取一篇文章的可跳转地址
 *
 * 优先用 NotionNext 已经算好的 href（'/' 开头，含 SUB_PATH），
 * 没有时退化为 `${SUB_PATH}/${slug}`；连 slug 都没有则返回空串（调用方回首页）。
 *
 * @param {object} post 文章记录
 * @param {string} subPath 站点子路径（SUB_PATH）
 * @returns {string} 可直接 router.push 的地址；无法确定时返回 ''
 */
export function resolvePostHref(post, subPath = '') {
  const href = (post?.href || '').toString().trim()
  if (href) {
    return href
  }
  const slug = (post?.slug || post?.id || '').toString().trim()
  if (!slug) {
    return ''
  }
  const prefix = (subPath || '').toString().replace(/\/+$/, '')
  return `${prefix}/${slug}`
}

/**
 * 从文章列表里随机挑一篇
 *
 * @param {Array} posts 候选文章（allNavPages）
 * @param {object} [options]
 * @param {string} [options.excludeHref] 需要排除的地址（通常是当前正在阅读的那篇，
 *   避免在文章页点「随机阅读」又回到同一篇）
 * @param {string} [options.subPath] 站点子路径（SUB_PATH）
 * @param {() => number} [options.random] 随机数发生器，默认 Math.random（注入便于单测）
 * @returns {object|null} 选中的文章；列表为空时返回 null
 */
export function pickRandomPost(posts, options = {}) {
  const list = Array.isArray(posts) ? posts.filter(Boolean) : []
  if (list.length === 0) {
    return null
  }

  const { excludeHref, subPath = '', random } = options

  // 排除当前这篇；但如果排除后一篇都不剩（只有一篇文章），
  // 退化为全集，保证「点了有反应」而不是原地不动
  let pool = list
  if (excludeHref) {
    const rest = list.filter(
      post => resolvePostHref(post, subPath) !== excludeHref
    )
    if (rest.length > 0) {
      pool = rest
    }
  }

  const next = typeof random === 'function' ? random : Math.random
  const value = Number(next())
  // 防住注入的假随机数返回 NaN / 1 / 负数导致下标越界
  const safe = Number.isFinite(value)
    ? Math.min(Math.max(value, 0), 0.999999)
    : 0
  const index = Math.floor(safe * pool.length) % pool.length

  return pool[index] || pool[0]
}

/**
 * 从文章列表里随机挑一篇并给出可跳转地址
 *
 * @param {Array} posts
 * @param {object} [options] 同 pickRandomPost
 * @returns {string} 地址；无可跳转目标时返回 ''
 */
export function pickRandomPostHref(posts, options = {}) {
  const post = pickRandomPost(posts, options)
  if (!post) {
    return ''
  }
  return resolvePostHref(post, options.subPath)
}
