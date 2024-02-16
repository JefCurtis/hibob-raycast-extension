import { LocalStorage, Toast, getPreferenceValues, showToast } from '@raycast/api'
import got from 'got'

const BASE_BOB_API_URL = 'https://api.hibob.com/v1'

async function fetch<Response>(route: string, cacheName: string): Promise<Response> {
    const token = getPreferenceValues().hibobToken

    const stored = await LocalStorage.getItem<string>(cacheName)
    if (stored) return JSON.parse(stored) as Response

    console.log(`🧹 CACHE MISSING - fetching ${cacheName} 🧹`)

    try {
        const response = await got
            .get(`${BASE_BOB_API_URL}${route}`, {
                responseType: 'json',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: token,
                },
            })
            .json<Response>()

        LocalStorage.setItem(cacheName, JSON.stringify(response))
        return response
    } catch (error) {
        console.error(`Error fetching ${route}: `, error)
        showToast({
            style: Toast.Style.Failure,
            title: 'Network response failed',
            message: 'Is your API key missing or invalid?',
        })
        return [] as Response
    }
}

export { fetch }
