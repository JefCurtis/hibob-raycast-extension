import { Calendar, CalendarDate } from 'calendar-base'
import { parseISO } from 'date-fns'
import { generateDateValue, getDatesInclusive } from './formatter'
import { PersonWithTimeOffs } from '../apis/people'

const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const generateCalendar = (person: PersonWithTimeOffs, date?: Date) => {
    const { timeOffs, displayName, title } = person

    if (!timeOffs || !date) {
        return ''
    }

    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    const timeOffDateRanges = timeOffs.map((to) => ({
        type: to.policyTypeDisplayName,
        dates: getDatesInclusive(parseISO(to.startDate), parseISO(to.endDate)),
    }))

    const c = new Calendar({ siblingMonths: true, weekNumbers: true, weekStart: 1 })
    const today = new Date()

    c.setStartDate({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() })
    const calendar = c.getCalendar(year, month) as CalendarDate[]

    const days = calendar.map((day) => generateDateValue(day, timeOffDateRanges)).join('')
    const header = date.toLocaleString('en', { month: 'long', year: 'numeric' })
    const headers = `| ${weekDays.join(' | ')} |`
    const separator = `|:---:|:---:|:---:|:---:|:---:|:---:|:---:|`

    return `## ${displayName}\n${title}\n ## ${header}\n${headers}\n${separator}\n${days}`
}

export { generateCalendar }
