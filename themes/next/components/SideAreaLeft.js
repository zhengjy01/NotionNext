import Live2D from '@/components/Live2D'
import Tabs from '@/components/Tabs'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import Card from './Card'
import InfoCard from './InfoCard'
import Logo from './Logo'
import { MenuList } from './MenuList'
import NowCard from './NowCard'
import SearchInput from './SearchInput'
import SocialCard from './SocialCard'
import Toc from './Toc'

/**
 * 侧边平铺
 * @param tags
 * @param currentTag
 * @param post
 * @param currentSearch
 * @returns {JSX.Element}
 * @constructor
 */
const SideAreaLeft = props => {
  const { post, slot, postCount } = props
  const { locale } = useGlobal()
  const showToc = post && post.toc && post.toc.length > 1
  return (
    <aside
      id='left'
      className={
        (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE')) ? 'ml-4' : 'mr-4') +
        ' hidden lg:block flex-col w-60 relative z-30'
      }
    >
      <section className='w-60'>
        {/* 菜单 */}
        <section className='shadow hidden lg:block mb-5 pb-4 bg-white dark:bg-hexo-black-gray hover:shadow-xl duration-200'>
          <Logo className='min-h-32 ' {...props} />
          <div className='pt-2 px-2 '>
            <MenuList allowCollapse={true} {...props} />
          </div>
          {siteConfig('NEXT_MENU_SEARCH', null, CONFIG) && (
            <div className='px-2 pt-2 '>
              <SearchInput {...props} />
            </div>
          )}
        </section>
      </section>

      {/* 侧栏整体可能高于视口（关于+联系方式+最近在做什么），超出时内部可滚动，避免底部被 sticky 永久裁掉 */}
      <div className='sidebar-scroll sticky top-4 hidden max-h-[calc(100vh-2rem)] overflow-y-auto lg:block'>
        <Card>
          <Tabs className='!mb-1'>
            {showToc && (
              <div
                key={locale.COMMON.TABLE_OF_CONTENTS}
                className='dark:text-gray-400 text-gray-600 bg-white dark:bg-hexo-black-gray duration-200'
              >
                <Toc toc={post.toc} />
              </div>
            )}

            <div
              key={locale.NAV.ABOUT}
              className='mb-2 bg-white dark:bg-hexo-black-gray duration-200 py-5'
            >
              <InfoCard {...props} />
              <>
                <div className='mt-2 text-center dark:text-gray-300 font-light text-xs'>
                  <span className='px-1 '>
                    <strong className='font-medium'>{postCount}</strong>{' '}
                    {locale.COMMON.POSTS}
                  </span>
                  <span className='px-1 busuanzi_container_site_uv hidden'>
                    |{' '}
                    <strong className='pl-1 busuanzi_value_site_uv font-medium' />
                    {locale.COMMON.VISITORS}
                  </span>
                  {/* <span className='px-1 busuanzi_container_site_pv hidden'>
                | <strong className='pl-1 busuanzi_value_site_pv font-medium'/>{locale.COMMON.VIEWS}</span> */}
                </div>
              </>
            </div>
          </Tabs>
        </Card>

        {/* 最近在做什么：由本机脚本生成的 data/now.json 驱动 */}
        <NowCard />

        {/* 社交联系方式：独立卡片展示，更醒目 */}
        <SocialCard {...props} />

        <div className='flex justify-center'>
          {slot}
          <Live2D />
        </div>
      </div>
    </aside>
  )
}
export default SideAreaLeft
