import { LocalStorage } from '@raycast/api'
import { BASE_API_URL, HI_BOB_API_KEY } from '../constants'
import got from 'got'

type WorkTitle = {
    id: string
    name: string
}

async function getWorkTitles() {
    const stored = await LocalStorage.getItem<string>('work-titles')
    if (stored) return JSON.parse(stored) as WorkTitle[]

    console.log('////////////////////////')
    console.log('API REQUEST -fetching work titles')

    const response = await got
        .get(`${BASE_API_URL}/company/named-lists/title`, {
            responseType: 'json',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: HI_BOB_API_KEY,
            },
        })
        .json<{ values: WorkTitle[] }>()

    const workTitles = response.values.map(({ id, name }) => ({ id, name }))
    LocalStorage.setItem('work-titles', JSON.stringify(workTitles))

    return workTitles
}

export type { WorkTitle }
export { getWorkTitles }
