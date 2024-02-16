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
    const departments = await getDepartments()
    const titles = await getWorkTitles()
    const OOO = await getTimeOffInfo(date)
    let people = await getPeople()

    if (department !== 'All') {
        people = people.filter((p) => {
            const match = departments.find((d) => d.id === p.work.department)
            return match?.name === department
        })
    }

    return people.map((person) => {
        return parse(person, departments, titles, OOO)
    })
}

async function getPeople() {
    const response = await fetch<{ employees: HibobApi.Person[] }>('/profiles', 'people')
    return response.employees
}

export type { PersonWithTimeOffs }
export { getPeople, fetchPeople }
