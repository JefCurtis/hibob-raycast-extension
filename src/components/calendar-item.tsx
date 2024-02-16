import {
    Action,
    ActionPanel,
    Cache,
    Color,
    Icon,
    List,
    LocalStorage,
    useNavigation,
} from '@raycast/api'
import { generateCalendar } from '../utils/calendar'
import { addMonths } from 'date-fns'
import { PersonWithTimeOffs } from '../apis/people'

const CalendarItem = ({
    person,
    date,
    setDate,
}: {
    person: PersonWithTimeOffs
    date: Date
    setDate: (date: Date) => void
}) => {
    const { pop } = useNavigation()
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
                            icon={Icon.Calendar}
                            onAction={() => {
                                setDate(addMonths(date, 1))
                            }}
                        />
                        <Action
                            title="Previous Month"
                            shortcut={{ modifiers: [], key: 'arrowLeft' }}
                            icon={Icon.Calendar}
                            onAction={() => {
                                setDate(addMonths(date, -1))
                            }}
                        />
                        <Action.OpenInBrowser
                            title="Open in Hibob"
                            url="https://app.hibob.com/time-off/peoples-time-off/calendar"
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
                                pop()
                            }}
                        />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    )
}

export { CalendarItem }
