import { List } from '@raycast/api'
import { useEffect, useState } from 'react'
import { useCachedPromise } from '@raycast/utils'
import { getDepartments, useDepartment } from './apis/departments'
import { CalendarItem } from './components/calendar-item'
import { PersonWithTimeOffs, fetchPeople } from './apis/people'

export default function Command() {
    const [date, setDate] = useState(new Date())
    const { data: departments } = useCachedPromise(getDepartments, [], {
        keepPreviousData: true,
    })

    const [department, setDepartment] = useDepartment()
    const [people, setPeople] = useState<PersonWithTimeOffs[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const list = await fetchPeople(date, department)
            setPeople(list)
            setIsLoading(false)
        }
        fetchData()
    }, [date, department])

    return (
        <List
            isShowingDetail={true}
            navigationTitle={department === 'All' ? 'All Departments' : department}
            throttle
            isLoading={isLoading}
            searchBarAccessory={
                <List.Dropdown
                    tooltip="Departments"
                    value={department}
                    onChange={(value) => {
                        setDepartment(value)
                    }}
                >
                    {departments?.map((d) => (
                        <List.Dropdown.Item key={d.id} title={d.name} value={d.name} />
                    ))}
                </List.Dropdown>
            }
        >
            {people?.map((person, i) => (
                <CalendarItem key={i} setDate={setDate} person={person} date={date} />
            ))}
        </List>
    )
}
