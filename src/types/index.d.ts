declare namespace HibobApi {
    type WorkTitle = {
        id: string
        name: string
    }

    export type Department = {
        id: string
        name: string
    }

    type TimeOff = {
        policyTypeDisplayName: string
        endDate: string // "2024-02-16";
        requestId: number
        policyType: string
        startPortion: string
        employeeId: string
        employeeDisplayName: string
        endPortion: string
        type: string
        startDate: string
        status: string
    }

    type Person = {
        id: string
        displayName: string
        surname: string
        firstName: string
        email: string
        department: number
        work: {
            department: string
            title: string
        }
        personal: {
            avatar: string
        }
    }
}

export type CalendarDate = {
    day: number
    month: number
    weekDay: number
    year: number
    selected: boolean
    siblingMonth: boolean
    weekNumber: number
}
