import { Calendar, CalendarDate } from 'calendar-base'
import { parseISO } from 'date-fns'
import { generateDateValue, getDatesInclusive } from './formatter'
import { PersonWithTimeOffs } from '../apis/people'

// Cache for calendar generation to avoid redundant calculations
const calendarCache = new Map<string, string>()

const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const generateCalendar = (person: PersonWithTimeOffs, date?: Date) => {
    const { timeOffs, displayName, title, id } = person

    if (!timeOffs || !date) {
        return ''
    }

    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    
    // Create cache key based on person ID, date, and time-off data
    const timeOffHashes = timeOffs.map(to => `${to.startDate}-${to.endDate}-${to.policyTypeDisplayName}`).join(',')
    const cacheKey = `${id}-${year}-${month}-${timeOffHashes}`
    
    // Check cache first
    if (calendarCache.has(cacheKey)) {
        return calendarCache.get(cacheKey)!
    }

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

    const result = `## ${displayName}\n${title}\n ## ${header}\n${headers}\n${separator}\n${days}`
    
    // Cache the result
    calendarCache.set(cacheKey, result)
    
    // Keep cache size reasonable (max 100 entries)
    if (calendarCache.size > 100) {
        const firstKey = calendarCache.keys().next().value
        if (firstKey) {
            calendarCache.delete(firstKey)
        }
    }
    
    return result
}

export { generateCalendar }