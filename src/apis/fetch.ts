import { LocalStorage, Toast, getPreferenceValues, showToast, openExtensionPreferences } from '@raycast/api'
import got from 'got'
import { BASE_API_URL } from '../constants'

type CacheEnvelope<T> = { ts: number; data: T }
const DEFAULT_TTL_MS = 1000 * 60 * 10 // 10 minutes

async function fetch<Response>(route: string, cacheName: string, ttlMs: number = DEFAULT_TTL_MS): Promise<Response> {
  const { hibobServiceUserId, hibobServiceUserToken } = getPreferenceValues<{
    hibobServiceUserId: string
    hibobServiceUserToken: string
  }>()

  // TTL cache
  const stored = await LocalStorage.getItem<string>(cacheName)
  if (stored) {
    try {
      const { ts, data } = JSON.parse(stored) as CacheEnvelope<Response>
      if (Date.now() - ts < ttlMs) return data
    } catch {
      // ignore corrupt cache
    }
  }

  console.log(`🧹 CACHE MISSING - fetching ${cacheName} 🧹`)

  if (!hibobServiceUserId || !hibobServiceUserToken) {
    await showToast({ style: Toast.Style.Failure, title: 'Missing HiBob credentials' })
    await openExtensionPreferences()
    throw new Error('Missing HiBob service user credentials')
  }

  const credentials = Buffer.from(
    `${hibobServiceUserId}:${hibobServiceUserToken}`,
    'utf8',
  ).toString('base64')

  try {
    const response = await got
      .get(`${BASE_API_URL}${route}`, {
        responseType: 'json',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Basic ${credentials}`,
        },
        timeout: { request: 10_000 },
        retry: { limit: 2 },
      })
      .json<Response>()

    await LocalStorage.setItem(cacheName, JSON.stringify({ ts: Date.now(), data: response } satisfies CacheEnvelope<Response>))
    return response
  } catch (error: any) {
    const status = error?.response?.statusCode
    console.error(`Error fetching ${route}: `, error)
    await showToast({
      style: Toast.Style.Failure,
      title: 'HiBob request failed',
      message: status ? `HTTP ${status}` : 'Network error',
    })
    if (status === 401 || status === 403) await openExtensionPreferences()
    throw error
  }
}

export { fetch }
