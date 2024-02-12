import { Calendar } from 'calendar-base'
import { Out } from '../utils/whos-out'

export type CalendarDate = {
    day: number
    month: number
    weekDay: number
    year: number
    selected: boolean
    siblingMonth?: boolean
    weekNumber?: number
}

const weekDaysMap: { [key: number]: string } = {
    0: 'Su',
    1: 'Mo',
    2: 'Tu',
    3: 'We',
    4: 'Th',
    5: 'Fr',
    6: 'Sa',
}

const calendar = (names?: Out[], date?: Date) => {
    console.log(`calendar`)

    if (!names || !date) {
        return ''
    }

    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    const day = date.getDate()
    console.log(`day: `, day)

    const c = new Calendar({ siblingMonths: true, weekNumbers: true })
    c.setStartDate({ year, month, day })

    const calendar = c.getCalendar(year, month).filter(Boolean) as CalendarDate[]
    const dateIndex = calendar.findIndex((date) => date.selected)
    const oneWeek = calendar.splice(dateIndex, 7)

    const days = oneWeek
        .map((date) => (date.day === day ? `**${date.day}**` : `${date.day}`))
        .join(' | ')
    const header = date.toLocaleString('en', { month: 'long', year: 'numeric' })
    const headers = `| name | ${oneWeek.map((date) => weekDaysMap[date.weekDay]).join(' | ')} |`
    const separator = `|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|`
    const cells = names
        .map((item) => {
            const [firstName, lastName] = item.employeeDisplayName.split(' ')
            return `| ${firstName} ${lastName?.split('')[0]} | ${days} |`
        })
        .join(`\n`)

    return `# ${header}\n${headers}\n${separator}\n${cells}`
}

export { calendar }
