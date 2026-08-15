import { useState } from 'react'
import { subscribeToNewsletter } from '@/lib/plugins/mailchimp'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'

/**
 * 邮件订阅表单（侧边栏卡片内容）
 * 需在环境变量显式配置 NEXT_PUBLIC_MAILCHIMP_ENABLED=true 才会显示；
 * 不要用 MAILCHIMP_LIST_ID/API_KEY 自动推导——它们是服务端专属变量，浏览器端取不到，
 * 会导致 SSR 有卡片、水合后被移除（"刷新瞬间出现、加载完消失"）。
 * @returns
 */
const SubscribeForm = () => {
  const { locale } = useGlobal()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error'

  // 未配置 Mailchimp 环境变量时不渲染表单
  if (BLOG.NEXT_PUBLIC_MAILCHIMP_ENABLED !== 'true') {
    return null
  }

  const l = locale?.MAILCHIMP || {}
  const subscribeText = l.SUBSCRIBE || '订阅'

  const handleSubmit = async e => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setStatus(null)
    try {
      const data = await subscribeToNewsletter(email)
      if (data?.status === 'success') {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='px-4 py-3'>
      <div className='flex items-center gap-2 pb-2 text-sm text-gray-600 dark:text-gray-300'>
        <i className='fas fa-paper-plane text-brand-600 dark:text-brand-400' />
        {subscribeText}
      </div>
      <p className='pb-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400'>
        {l.MSG || ''}
      </p>
      <form onSubmit={handleSubmit} className='space-y-2'>
        <input
          type='email'
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={l.EMAIL || 'Email'}
          disabled={loading || status === 'success'}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-brand-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
        />
        <button
          type='submit'
          disabled={loading || status === 'success'}
          className='w-full rounded-lg bg-brand-600 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-600'
        >
          {loading ? '…' : subscribeText}
        </button>
        {status === 'success' && (
          <p className='text-xs text-green-600 dark:text-green-400'>
            {l.SUCCESS || '订阅成功'}
          </p>
        )}
        {status === 'error' && (
          <p className='text-xs text-red-500'>
            {l.ERROR || '订阅失败，请稍后重试'}
          </p>
        )}
      </form>
    </div>
  )
}

export default SubscribeForm
