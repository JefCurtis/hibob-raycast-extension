import { endOfMonth, formatDate, startOfMonth } from 'date-fns'
import { BASE_API_URL, HI_BOB_API_KEY } from '../constants'
import got from 'got'
import { LocalStorage } from '@raycast/api'

type TimeOff = {
    policyTypeDisplayName: string
    endDate: string // "2024-02-16";
    requestId: number
    policyType: string
    startPortion: string
    employeeId: string
    employeeDisplayName: string
    endPortion: string
    type: string
    startDate: string
    status: string
}

async function getTimeOffInfo(date: Date) {
    const startDate = startOfMonth(date)
    const endDate = endOfMonth(startDate)
    const monthAndYear = formatDate(startDate, 'yyyy-MM')
    const stored = await LocalStorage.getItem<string>(`timeOffs-${monthAndYear}`)
    if (stored) return JSON.parse(stored) as TimeOff[]

    console.log('////////////////////////')
    console.log('API REQUEST -fetching timeoffs')

    const params = new URLSearchParams({
        from: formatDate(startDate, 'yyyy-MM-dd'),
        to: formatDate(endDate, 'yyyy-MM-dd'),
    })

    const response = await got
        .get(`${BASE_API_URL}/timeoff/whosout?${params.toString()}`, {
            responseType: 'json',
            headers: {
                Authorization: HI_BOB_API_KEY,
            },
        })

        .json<{ outs: TimeOff[] }>()

    LocalStorage.setItem(`timeOffs-${monthAndYear}`, JSON.stringify(response.outs))
    return response.outs
}

export type { TimeOff }
export { getTimeOffInfo }
