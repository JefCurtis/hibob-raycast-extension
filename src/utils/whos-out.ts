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

const formatDate = (date: Date) => {
    // return date format "yyyy-MM-dd";
    return date.toISOString().split('T')[0]
}

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

        .json<{ outs: Out[] }>()

    // response.outs.forEach((out) => {
    //     console.log(out)
    // })

    return response.outs
}

export { getWhosOut }
