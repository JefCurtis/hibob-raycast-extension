import { HibobApi } from '../types'
import { fetch } from './fetch'

async function getWorkTitles() {
    const response = await fetch<{ values: HibobApi.WorkTitle[] }>(
        '/company/named-lists/title',
        'work-titles',
    )
    return response.values
}

export { getWorkTitles }
