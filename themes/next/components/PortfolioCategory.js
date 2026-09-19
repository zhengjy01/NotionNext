import { useState } from 'react'
import PortfolioCard from './PortfolioCard'

/**
 * 作品集分类分组（折叠展开）
 * 标题行：分类名 + 作品数，点击展开/收起
 * 面板保留在 DOM 中（利于 SEO/静态导出），收起时用 grid-rows + inert 隐藏，不参与键盘焦点
 * @param {{ group: {key,name,items}, defaultOpen?: boolean }} props
 */
const PortfolioCategory = ({ group, defaultOpen = false }) => {
  const [open, setOpen] = useState(!!defaultOpen)
  const panelId = `portfolio-category-${group.key}`

  return (
    <section className='border-b border-gray-100 last:border-b-0 dark:border-gray-800'>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className='group flex w-full items-center justify-between gap-4 py-5 text-left'>
        <span className='flex min-w-0 items-baseline gap-3'>
          <span
            className={`truncate font-serif text-lg font-medium transition-colors duration-200 ${
              open
                ? 'text-brand-600 dark:text-brand-300'
                : 'text-gray-800 group-hover:text-brand-600 dark:text-gray-100 dark:group-hover:text-brand-300'
            }`}>
            {group.name}
          </span>
          <span className='shrink-0 text-xs tabular-nums text-gray-400 dark:text-gray-500'>
            {group.items.length}
          </span>
        </span>
        <svg
          viewBox='0 0 24 24'
          aria-hidden='true'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={`h-4 w-4 shrink-0 transition-all duration-300 group-hover:text-brand-500 ${
            open
              ? 'rotate-180 text-brand-500 dark:text-brand-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}>
          <path d='M6 9l6 6 6-6' />
        </svg>
      </button>

      <div
        id={panelId}
        inert={open ? undefined : ''}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}>
        <div className='overflow-hidden'>
          <div className='grid grid-cols-1 gap-6 pb-8 pt-1 sm:grid-cols-2 lg:grid-cols-3'>
            {group.items.map(item => (
              <PortfolioCard key={item.id || item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioCategory
