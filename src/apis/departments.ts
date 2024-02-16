import { useCachedState } from '@raycast/utils'
import { HibobApi } from '../types'
import { fetch } from './fetch'

async function getDepartments() {
    const response = await fetch<{ values: HibobApi.Department[] }>(
        '/company/named-lists/department',
        'departments',
    )
    const all = { id: '123', name: 'All' }
    return [all, ...response.values.map(({ id, name }) => ({ id, name }))]
}

function useDepartment() {
    const [department, setDepartment] = useCachedState('department', 'All')

    return [department, setDepartment] as const
}

export { getDepartments, useDepartment }
