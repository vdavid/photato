/**
 * E.g. "2020. május 31., vasárnap 23:59"
 *
 * @param localeCode E.g. "en-US"
 */
export function formatDateWithWeekDayAndTime(date: Date, localeCode: string): string {
  return new Intl.DateTimeFormat(localeCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)
}

/**
 * E.g. "2020. május 31., vasárnap"
 *
 * @param localeCode E.g. "en-US"
 */
export function formatDateWithWeekDay(date: Date, localeCode: string): string {
  return new Intl.DateTimeFormat(localeCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date)
}

/**
 * @param timeZone E.g. "America/New_York"
 * @returns "YYYY-MM-DD"
 */
export function toISODateString(date: Date, _timeZone: string): string {
  return (
    date.toLocaleDateString('en', { timeZone: 'Europe/Budapest', year: 'numeric' }) +
    '-' +
    date.toLocaleDateString('en', { timeZone: 'Europe/Budapest', month: '2-digit' }) +
    '-' +
    date.toLocaleDateString('en', { timeZone: 'Europe/Budapest', day: '2-digit' })
  )
}

/**
 * @param timeZone E.g. "America/New_York"
 * @returns "YYYY-MM-DD hh:mm"
 */
export function toISODateStringWithHHMM(date: Date, timeZone: string): string {
  return (
    toISODateString(date, timeZone) +
    ' ' +
    date.toLocaleString('en', { timeZone: 'Europe/Budapest', hour: '2-digit', minute: '2-digit', hour12: false })
  )
}

export function addDaysToDate(date: Date, days: number): Date {
  const date2 = new Date(date.valueOf())
  date2.setDate(date2.getDate() + days)
  return date2
}

/**
 * @param date1 Only the date part will be used (not the time)
 * @param date2 Only the date part will be used (not the time)
 * @returns The difference in days (e.g. 2). Will be positive if date2 > date1
 */
export function getDifferenceInDays(date1: Date, date2: Date): number {
  const date1WithoutTime = new Date(date1.valueOf())
  date1WithoutTime.setHours(0, 0, 0, 0)
  const date2WithoutTime = new Date(date2.valueOf())
  date2WithoutTime.setHours(0, 0, 0, 0)
  const diffTime = date2WithoutTime.getTime() - date1WithoutTime.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
