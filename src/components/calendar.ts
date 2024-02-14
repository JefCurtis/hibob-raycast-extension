import { Calendar } from 'calendar-base'
import { generateDateValue, getDates } from '../utils/formatter'
import { PersonWithTimeOffs } from '../utils/people'

export type CalendarDate = {
    day: number
    month: number
    weekDay: number
    year: number
    selected: boolean
    siblingMonth: boolean
    weekNumber: number
}

const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const generateCalendar = (person: PersonWithTimeOffs, date?: Date) => {
    console.time('generateCalendar')
    const { timeOffs, displayName, title } = person

    if (!timeOffs || !date) {
        return ''
    }

    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    const timeOffDateRanges = timeOffs.flatMap((to) => ({
        type: to.policyTypeDisplayName,
        dates: getDates(new Date(to.startDate), new Date(to.endDate)),
    }))

    const c = new Calendar({ siblingMonths: true, weekNumbers: true, weekStart: 1 })
    const today = new Date()
    c.setStartDate({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() })

    const calendar = c.getCalendar(year, month) as CalendarDate[]

    const days = calendar.map((day) => generateDateValue(day, timeOffDateRanges)).join('')
    const header = date.toLocaleString('en', { month: 'long', year: 'numeric' })
    const headers = `| ${weekDays.join(' | ')} |`
    const separator = `|:---:|:---:|:---:|:---:|:---:|:---:|:---:|`
    console.timeEnd('generateCalendar')
    return `## ${displayName}\n${title}\n ## ${header}\n${headers}\n${separator}\n${days}`
}

export { generateCalendar }
