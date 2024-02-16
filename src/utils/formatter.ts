import { CalendarDate } from 'calendar-base'
import { addDays } from 'date-fns'

const getDatesInclusive = (startDate: Date, endDate: Date) => {
    const dates = []
    let currentDate = startDate

    while (currentDate <= endDate) {
        dates.push(currentDate)
        currentDate = addDays(currentDate, 1)
    }

    return dates
}

function generateDateValue(day: CalendarDate, offTimes: { type: string; dates: Date[] }[]) {
    const firstDayOfWeek = day.weekDay === 1
    const lastDayOfWeek = day.weekDay === 0
    const isWeekendDay = day.weekDay === 0 || day.weekDay === 6

    const matchingTimeOff = offTimes.find((ot) =>
        ot.dates.some(
            (date) =>
                date.getUTCMonth() === day.month &&
                date.getUTCDate() === day.day &&
                date.getUTCFullYear() === day.year,
        ),
    )

    let content = ''

    if (isWeekendDay) {
        content = `${day.day}`
    } else {
        content = `**${day.day}**`
    }

    switch (matchingTimeOff?.type) {
        case 'Conference/Course/Training':
            content = '📚'
            break
        case 'Vacation & National Holidays':
            content = '🏖️'
            break
        case 'Company Travel':
            content = '✈️'
            break
        case 'Health Day':
            content = '🤒'
            break
    }

    if (day.siblingMonth) {
        content = ''
    }

    if (day.selected) {
        content = `◎`
    }

    if (firstDayOfWeek) {
        return `| ${content} |`
    } else if (lastDayOfWeek) {
        return ` ${content} |\n`
    } else {
        return ` ${content} |`
    }
}

export { getDatesInclusive, generateDateValue }
