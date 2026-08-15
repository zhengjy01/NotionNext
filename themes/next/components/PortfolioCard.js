import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'

/**
 * 作品集卡片
 * @param {*} props
 * @returns
 */
const PortfolioCard = ({ item }) => {
  const { locale } = useGlobal()
  const cover = item.pageCoverThumbnail || item.pageCover || item.pageIcon || ''
  const hasUrl = !!item.url

  return (
    <div className='group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-hexo-black-gray'>
      {cover && (
        <div className='relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-800'>
          <img
            src={cover}
            alt={item.title}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
            loading='lazy'
          />
        </div>
      )}
      <div className='flex flex-1 flex-col p-5'>
        <h3 className='mb-2 text-lg font-bold leading-snug text-gray-800 dark:text-gray-100'>
          {item.title}
        </h3>
        {item.summary && (
          <p className='mb-4 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3 dark:text-gray-400'>
            {item.summary}
          </p>
        )}
        {item.category && (
          <div className='mb-3'>
            <span className='inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs text-brand-600 dark:bg-brand-900/30 dark:text-brand-300'>
              {item.category}
            </span>
          </div>
        )}
        <div className='mt-auto'>
          {hasUrl ? (
            <SmartLink
              href={item.url}
              className='inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600'
            >
              <i className='fas fa-external-link-alt text-xs' />
              {locale?.COMMON?.VIEW || '访问'}
            </SmartLink>
          ) : (
            <span className='inline-block rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-400 dark:bg-gray-800'>
              {locale?.COMMON?.NO_URL || '暂无链接'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default PortfolioCard
