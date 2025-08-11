import { List } from '@raycast/api'
import { useEffect, useState, useMemo } from 'react'
import { useCachedPromise } from '@raycast/utils'
import { getDepartments, useDepartment } from './apis/departments'
import { CalendarItem } from './components/calendar-item'
import { PersonWithTimeOffs, fetchPeople } from './apis/people'
import { initializeCache } from './utils/time-off-types'

export default function Command() {
    const [date, setDate] = useState(new Date())
    const { data: departments } = useCachedPromise(getDepartments, [], {
        keepPreviousData: true,
    })

    const [department, setDepartment] = useDepartment()
    const [allPeople, setAllPeople] = useState<PersonWithTimeOffs[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Initialize emoji cache on component mount
    useEffect(() => {
        initializeCache()
    }, [])

    // Fetch ALL people data only when date changes (not department)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const list = await fetchPeople(date, 'All') // Always fetch all people
            setAllPeople(list)
            setIsLoading(false)
        }
        fetchData()
    }, [date]) // Remove department from dependency array

    // Filter people by department client-side (instant)
    const filteredPeople = useMemo(() => {
        if (department === 'All') return allPeople
        return allPeople.filter(person => person.department === department)
    }, [allPeople, department])

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
            {filteredPeople?.map((person) => (
                <CalendarItem key={person.id} setDate={setDate} person={person} date={date} />
            ))}
        </List>
    )
}
