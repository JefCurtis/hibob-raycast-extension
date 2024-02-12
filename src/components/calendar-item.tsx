import { Calendar } from 'calendar-base'
import { List } from '@raycast/api'
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

const CalendarItem = ({ out, date }: { out: Out; date: Date }) => {
    console.log(`calendar`)

    if (!out || !date) {
        return null
    }

    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    const day = date.getDate()

    const c = new Calendar({ siblingMonths: true, weekNumbers: true })
    c.setStartDate({ year, month, day })

    const calendar = c.getCalendar(year, month).filter(Boolean) as CalendarDate[]
    const dateIndex = calendar.findIndex((date) => date.selected)
    const oneWeek = calendar.splice(dateIndex, 7)

    const days = oneWeek
        .map((date) => (date.day === day ? `**${date.day}**` : `${date.day} 🏖️`))
        .join(' | ')
    const separator = `|:---:|:---:|:---:|:---:|:---:|:---:|:---:|`
    const header = date.toLocaleString('en', { month: 'long', year: 'numeric' })
    const headers = `| ${oneWeek.map((date) => weekDaysMap[date.weekDay]).join(' | ')} |`
    console.log(`days: `, days)

    const table = calendar
        .map((week) => {
            let row = `| **${weekStart === 0 ? weekNumberSun(week[0]) : weekNumber(week[0])}** |`

            row += week
                .map((day) => {
                    const dayString =
                        day.getMonth() === date.getMonth() ? day.getDate().toString() : ' '
                    const todayMarker =
                        day.toDateString() === today && dayString !== ' ' ? '**• ' : ' '
                    return `${todayMarker}${dayString}${todayMarker !== ' ' ? '**' : ''} |`
                })
                .join('')

            return `${row}\n`
        })
        .join('')

    return (
        <List.Item
            title={out.employeeDisplayName}
            subtitle={out.status}
            detail={
                <List.Item.Detail markdown={`### ${header}\n${headers}\n${separator}\n${days}`} />
            }
        />
    )
    // return names
    //     .map((item) => {
    //         const [firstName, lastName] = item.employeeDisplayName.split(' ')
    //         return `| ${firstName} ${lastName?.split('')[0]} | ${days} |`
    //     })
    //     .join(`\n`)
}

export { CalendarItem }
