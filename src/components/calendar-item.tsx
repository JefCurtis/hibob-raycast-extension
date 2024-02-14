import { Action, ActionPanel, Cache, Color, Icon, List, LocalStorage } from '@raycast/api'
import { generateCalendar } from './calendar'
import { addMonths } from 'date-fns'
import { PersonWithTimeOffs } from '../utils/people'

export type CalendarDate = {
    day: number
    month: number
    weekDay: number
    year: number
    selected: boolean
    siblingMonth?: boolean
    weekNumber?: number
}

const CalendarItem = ({
    person,
    date,
    setDate,
}: {
    person: PersonWithTimeOffs
    date: Date
    setDate: (date: Date) => void
}) => {
    console.log('CalendarItme')

    const header = date.toLocaleString('en', { month: 'long', year: 'numeric' })

    return (
        <List.Item
            title={person.displayName}
            detail={<List.Item.Detail markdown={generateCalendar(person, date)} />}
            actions={
                <ActionPanel title={header}>
                    <ActionPanel.Section title="Change Month">
                        <Action
                            title="Next Month"
                            shortcut={{ modifiers: [], key: 'arrowRight' }}
                            icon={{ source: { dark: 'right-dark.png', light: 'right.png' } }}
                            onAction={() => {
                                setDate(addMonths(date, 1))
                            }}
                        />
                        <Action
                            title="Previous Month"
                            shortcut={{ modifiers: [], key: 'arrowLeft' }}
                            icon={{ source: { dark: 'left-dark.png', light: 'left.png' } }}
                            onAction={() => {
                                setDate(addMonths(date, -1))
                            }}
                        />
                    </ActionPanel.Section>
                    <ActionPanel.Section title="Calendar">
                        <Action
                            icon={{ source: Icon.Trash, tintColor: Color.Red }}
                            title="Clear Cache and Refresh"
                            onAction={() => {
                                LocalStorage.clear()
                                const cache = new Cache()
                                cache.clear()
                            }}
                        />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    )
}

export { CalendarItem }
