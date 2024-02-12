import { useCachedState } from '@raycast/utils'
import { Cache } from '@raycast/api'
import { BASE_API_URL, HI_BOB_API_KEY } from '../constants'
import got from 'got'
import { log } from 'console'

export type DepartmentName =
    | 'All'
    | 'People'
    | 'Finance'
    | 'Android Engineering'
    | 'Apple Engineering'
    | 'Backend Engineering'
    | 'CXO'
    | 'Customer Experience'
    | 'Design'
    | 'Frontend Engineering'
    | 'Infrastructure Engineering'
    | 'Remote'
    | 'Marketing'
    | 'Product'

export type Department = {
    id: string
    name: DepartmentName
}

export async function getStoredDepartment() {
    const cache = new Cache()
    const department = (await cache.get('department')) || 'all'
    return department as DepartmentName
}

async function getDepartments() {
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
    const departments = response.values.map(({ id, name }) => ({ id, name }))

    return [{ id: '123', name: 'All' }, ...departments] as Department[]
}

function useDepartment() {
    const [department, setDepartment] = useCachedState<DepartmentName>('department', 'All')

    return [department, setDepartment] as const
}

export { getDepartments, useDepartment }
