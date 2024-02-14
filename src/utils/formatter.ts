import { CalendarDate } from '../components/calendar'

function getDates(startDate: Date, endDate: Date, steps = 1) {
    const dateArray = []
    const currentDate = new Date(startDate)

    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate))
        // Use UTC date to prevent problems with time zones and DST
        currentDate.setUTCDate(currentDate.getUTCDate() + steps)
    }

    return dateArray
}

function generateDateValue(day: CalendarDate, dates: { type: string; dates: Date[] }[]) {
    const bullet = day.selected ? '' : ''
    const firstDayOfWeek = day.weekDay === 1
    const lastDayOfWeek = day.weekDay === 0
    const isWeekendDay = day.weekDay === 0 || day.weekDay === 6
    const matchingTimeOff = dates.find((d) => d.dates.some((date) => date.getUTCDate() === day.day))

    let content = ''

    if (day.siblingMonth) {
        content = ''
    } else if (isWeekendDay) {
        content = `${day.day}`
    } else {
        content = `**${day.day}**`
    }

    if (matchingTimeOff) {
        switch (matchingTimeOff.type) {
            case 'Vacation & National Holidays':
                content = '🏖️'
                break
            case 'Company Travel':
                content = '✈️'
                break
            case 'Sick Leave':
                content = '🤒'
                break
            default:
                break
        }
    }

    if (firstDayOfWeek) {
        return `| ${bullet}${content} |`
    } else if (lastDayOfWeek) {
        return ` ${bullet}${content} |\n`
    } else {
        return ` ${bullet}${content} |`
    }
}

export { getDates, generateDateValue }
