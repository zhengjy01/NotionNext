import BLOG from '@/blog.config'
import md5 from 'js-md5'

/**
 * 解析 Mailchimp API 数据中心
 * API key 格式为 {key}-{dc}，例如 a1b2c3-us18；解析失败时默认 us18
 * @param {string} apiKey
 * @returns {string}
 */
function getDataCenter(apiKey) {
  const parts = (apiKey || '').split('-')
  return parts.length > 1 ? parts[parts.length - 1] : 'us18'
}

/**
 * 订阅邮件-服务端接口
 * 使用 PUT /members/{subscriberHash} 实现 upsert：
 * 未订阅则创建，已订阅则更新，重复提交不会报冲突
 * @param {*} email
 * @returns {Promise<{ok: boolean, status?: number, detail?: string, error?: string}>}
 */
export default async function subscribeToMailchimpApi({
  email,
  first_name = '',
  last_name = ''
}) {
  const listId = BLOG.MAILCHIMP_LIST_ID // 替换为你的邮件列表 ID
  const apiKey = BLOG.MAILCHIMP_API_KEY // 替换为你的 API KEY
  if (!email || !listId || !apiKey) {
    return { ok: false, error: 'MAILCHIMP_NOT_CONFIGURED' }
  }
  const dc = getDataCenter(apiKey)
  const subscriberHash = md5(email.trim().toLowerCase())
  const data = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: first_name,
      LNAME: last_name
    }
  }
  const response = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `apikey ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  )

  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = body?.detail || body?.title || ''
    } catch (error) {
      // 忽略响应体解析失败
    }
    return { ok: false, status: response.status, detail }
  }
  return { ok: true, status: response.status }
}

/**
 * 客户端接口
 * @param {*} email
 * @param {*} firstName
 * @param {*} lastName
 * @returns
 */
export async function subscribeToNewsletter(email, firstName, lastName) {
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, first_name: firstName, last_name: lastName })
  })
  const data = await response.json()
  return data
}
