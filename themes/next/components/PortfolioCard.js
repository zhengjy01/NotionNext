import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'

/**
 * 作品集卡片
 * 简洁版：衬线标题 + 两行摘要 + 轻量「访问 →」链接
 * @param {*} props
 * @returns
 */
const PortfolioCard = ({ item }) => {
  const { locale } = useGlobal()
  const cover = item.pageCoverThumbnail || item.pageCover || item.pageIcon || ''
  const hasUrl = !!item.url

  return (
    <div className='group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-gray-800 dark:bg-hexo-black-gray dark:hover:border-brand-500/40'>
      {cover && (
        <div className='mb-4 h-36 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800'>
          <img
            src={cover}
            alt={item.title}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
            loading='lazy'
          />
        </div>
      )}
      <h3 className='font-serif text-lg font-medium leading-snug text-gray-800 transition-colors group-hover:text-brand-600 dark:text-gray-100 dark:group-hover:text-brand-300'>
        {item.title}
      </h3>
      {item.summary && (
        <p className='mt-2 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-2 dark:text-gray-400'>
          {item.summary}
        </p>
      )}
      <div className='mt-auto flex items-center gap-2 pt-4'>
        {hasUrl ? (
          <SmartLink
            href={item.url}
            className='inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200'>
            <span>{locale?.COMMON?.VIEW || '访问'}</span>
            <i className='fas fa-arrow-right' />
          </SmartLink>
        ) : (
          <span className='text-sm text-gray-400 dark:text-gray-500'>
            {locale?.COMMON?.NO_URL || '暂无链接'}
          </span>
        )}
      </div>
    </div>
  )
}

export default PortfolioCard
