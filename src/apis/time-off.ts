import { endOfMonth, formatDate, startOfMonth } from 'date-fns'
import { fetch } from './fetch'
import { HibobApi } from '../types'

async function getTimeOffInfo(date: Date) {
    const startDate = startOfMonth(date)
    const endDate = endOfMonth(startDate)

    const monthAndYear = formatDate(startDate, 'yyyy-MM')
    const cacheName = `timeOffs-${monthAndYear}`

    const params = new URLSearchParams({
        from: formatDate(startDate, 'yyyy-MM-dd'),
        to: formatDate(endDate, 'yyyy-MM-dd'),
    })
    const url = `/timeoff/whosout?${params.toString()}`
    const response = await fetch<{ outs: HibobApi.TimeOff[] }>(url, cacheName)
    return response.outs
}

export { getTimeOffInfo }
