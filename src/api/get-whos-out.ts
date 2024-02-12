import { BASE_API_URL, HI_BOB_API_KEY } from '../constants'
import got from 'got'

export type Out = {
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

export type People = {
    id: string
    email: string
    first: string
    last: string
    department: number
}

export type Department = {
    id: string
    name: string
}

const formatDate = (date: Date) => {
    // return date format "yyyy-MM-dd";
    return date.toISOString().split('T')[0]
}

// export async function getTodayFeaturedPageUrl(language: string) {
//     const today = new Date()
//     const year = today.getFullYear()
//     const month = (today.getMonth() + 1).toString().padStart(2, '0')
//     const day = today.getDate().toString().padStart(2, '0')
//     const response = await got
//         .get(`${getApiUrl(language)}api/rest_v1/feed/featured/${year}/${month}/${day}`)
//         .json<{ tfa: PageSummary }>()
//     return {
//         url: response.tfa.content_urls.desktop.page,
//         title: response.tfa.title,
//     }
// }

async function getWhosOut(startDate: Date) {
    const endDate = new Date(startDate.setDate(startDate.getDate() + 7))

    const params = new URLSearchParams({
        from: formatDate(startDate),
        to: formatDate(endDate),
    })

    const response = await got
        .get(`${BASE_API_URL}/timeoff/whosout?${params.toString()}`, {
            responseType: 'json',
            headers: {
                Authorization: HI_BOB_API_KEY,
            },
        })

        .json<{ outs: Outs[] }>()

    return response.outs
}

async function getPeople() {
    const response = await got
        .get(`${BASE_API_URL}/profiles`, {
            responseType: 'json',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: HI_BOB_API_KEY,
            },
        })
        .json<{ employees: People[] }>()

    return response.employees
}

export { getWhosOut, getPeople }
