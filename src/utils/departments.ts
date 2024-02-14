import { LocalStorage } from '@raycast/api'
import { useCachedState } from '@raycast/utils'
import { BASE_API_URL, HI_BOB_API_KEY } from '../constants'
import got from 'got'

export type Department = {
    id: string
    name: string
}

async function getDepartments() {
    const stored = await LocalStorage.getItem<string>('departments')
    if (stored) return JSON.parse(stored) as Department[]

    console.log('////////////////////////')
    console.log('API REQUEST -fetching departments')

    const response = await got
        .get(`${BASE_API_URL}/company/named-lists/department`, {
            responseType: 'json',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: HI_BOB_API_KEY,
            },
        })
        .json<{ values: Department[] }>()

    const all = { id: '123', name: 'All' }
    const departments = [all, ...response.values.map(({ id, name }) => ({ id, name }))]
    LocalStorage.setItem('departments', JSON.stringify(departments))

    return departments as Department[]
}

function useDepartment() {
    const [department, setDepartment] = useCachedState('department', 'All')

    return [department, setDepartment] as const
}

export { getDepartments, useDepartment }
