import subscribeToMailchimpApi from '@/lib/plugins/mailchimp'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * 接受邮件订阅
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' })
  }

  const { email, firstName, lastName } = req.body || {}

  // 邮箱格式校验
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ status: 'error', message: 'Invalid email address' })
  }

  try {
    const result = await subscribeToMailchimpApi({
      email: email.trim(),
      first_name: firstName,
      last_name: lastName
    })

    if (!result.ok) {
      if (result.error === 'MAILCHIMP_NOT_CONFIGURED') {
        return res
          .status(500)
          .json({ status: 'error', message: 'Subscription service not configured' })
      }
      return res.status(result.status || 400).json({
        status: 'error',
        message: result.detail || 'Subscription failed'
      })
    }

    res.status(200).json({ status: 'success', message: 'Subscription successful!' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Subscription failed!', error: String(error) })
  }
}
