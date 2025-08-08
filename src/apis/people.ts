import { getTimeOffInfo } from './time-off'
import { getDepartments } from './departments'
import { getWorkTitles } from './work-titles'
import { HibobApi } from '../types'
import { fetch } from './fetch'

type PersonWithTimeOffs = {
    id: string
    displayName: string
    surname: string
    firstName: string
    email: string
    title: string
    avatar: string
    department: string
    timeOffs?: HibobApi.TimeOff[]
}

function parse(
    person: HibobApi.Person,
    departments: HibobApi.Department[],
    titles: HibobApi.WorkTitle[],
    OOO: HibobApi.TimeOff[],
): PersonWithTimeOffs {
    const department = departments.find((d) => d.id === person.work.department)
    const timeOffs = OOO.filter((o) => o.employeeId === person.id)
    const title = titles.find((t) => t.id === person.work.title)

    const { id, displayName, surname, firstName, email, personal } = person

    return {
        id,
        displayName,
        surname,
        firstName,
        email,
        title: title?.name || '',
        avatar: personal.avatar,
        department: department?.name || 'All',
        timeOffs,
    }
}

async function fetchPeople(date: Date, department = 'All') {
    const [departments, titles, OOO, people] = await Promise.all([
        getDepartments(),
        getWorkTitles(),
        getTimeOffInfo(date),
        getPeople(),
    ])

    const deptById = new Map(departments.map((d) => [d.id, d.name]))
    const titleById = new Map(titles.map((t) => [t.id, t.name]))

    let filtered = people
    if (department !== 'All') {
        filtered = people.filter((p) => deptById.get(p.work.department) === department)
    }

    return filtered.map((person) => {
        const departmentName = deptById.get(person.work.department) || 'All'
        const timeOffs = OOO.filter((o) => o.employeeId === person.id)
        const titleName = titleById.get(person.work.title) || ''
        const { id, displayName, surname, firstName, email, personal } = person
        return {
            id,
            displayName,
            surname,
            firstName,
            email,
            title: titleName,
            avatar: personal.avatar,
            department: departmentName,
            timeOffs,
        }
    })
}

async function getPeople() {
    const response = await fetch<{ employees: HibobApi.Person[] }>('/profiles', 'people')
    return response.employees
}

export type { PersonWithTimeOffs }
export { getPeople, fetchPeople }
