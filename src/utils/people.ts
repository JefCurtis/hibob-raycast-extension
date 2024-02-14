import got from 'got'
import { BASE_API_URL, HI_BOB_API_KEY } from '../constants'
import { TimeOff, getTimeOffInfo } from './time-off'
import { Department, getDepartments } from './departments'
import { WorkTitle, getWorkTitles } from './work-titles'
import { LocalStorage } from '@raycast/api'

type Person = {
    id: string
    displayName: string
    surname: string
    firstName: string
    email: string
    department: number
    work: {
        department: string
        title: string
    }
    personal: {
        avatar: string
    }
}

type PersonWithTimeOffs = {
    id: string
    displayName: string
    surname: string
    firstName: string
    email: string
    title: string
    avatar: string
    department: string
    timeOffs?: TimeOff[]
}

function parse(
    person: Person,
    departments: Department[],
    titles: WorkTitle[],
    OOO: TimeOff[],
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

async function getPeople(): Promise<Person[]> {
    const stored = await LocalStorage.getItem<string>('people')
    if (stored) return JSON.parse(stored) as Person[]

    console.log('////////////////////////')
    console.log('API REQUEST - fetching people')

    const response = await got
        .get(`${BASE_API_URL}/profiles`, {
            responseType: 'json',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: HI_BOB_API_KEY,
            },
        })
        .json<{ employees: Person[] }>()

    LocalStorage.setItem('people', JSON.stringify(response.employees))
    return response.employees
}

export type { PersonWithTimeOffs }
export { getPeople, fetchPeople }
