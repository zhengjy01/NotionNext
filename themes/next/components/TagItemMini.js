import SmartLink from '@/components/SmartLink'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <SmartLink
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      passHref
      className={`cursor-pointer inline-block rounded hover:bg-gray-500 hover:text-white duration-200
        mr-2 py-0.5 px-1 text-xs whitespace-nowrap dark:hover:text-white
         ${
           selected
             ? 'text-white dark:text-gray-300 bg-black dark:bg-black dark:hover:bg-gray-900'
             : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:shadow-xl'
         }`}
    >
      <div className='font-light dark:text-gray-400'>
        {selected && <i className='fas fa-tag mr-1' />} {tag.name}
        {tag.count ? <span className='opacity-50'>({tag.count})</span> : null}
      </div>
    </SmartLink>
  )
}

export default TagItemMini
