import { add, sub, addDays, differenceInDays, parse } from 'date-fns'
import { ja } from 'date-fns/locale'
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

export const getJapaneseDay = (dateStr: string) => {
  const date = utcToZonedTime(new Date(dateStr), 'Asia/Tokyo')
  const day = format(date, 'MM/dd(eee)', { locale: ja })
  return day
}

export const getToday = () => {
  const nowInJapan = utcToZonedTime(new Date(), 'Asia/Tokyo')
  return format(nowInJapan, 'yyyy-MM-dd')
}

export const getTomorrow = () => {
  const nowInJapan = utcToZonedTime(new Date(), 'Asia/Tokyo')
  const tomorrowInJapan = add(nowInJapan, { days: 1 })
  return format(tomorrowInJapan, 'yyyy-MM-dd')
}

export const getNextDay = (dateStr: string) => {
  const date = utcToZonedTime(new Date(dateStr), 'Asia/Tokyo')
  const nextDay = add(date, { days: 1 })
  return format(nextDay, 'yyyy-MM-dd')
}

export const getPreviousDay = (dateStr: string) => {
  const date = utcToZonedTime(new Date(dateStr), 'Asia/Tokyo')
  const previousDay = sub(date, { days: 1 })
  return format(previousDay, 'yyyy-MM-dd')
}

export const formatDate = (dateStr: string) => {
  const date = utcToZonedTime(new Date(dateStr), 'Asia/Tokyo')
  return format(date, 'yyyy/MM/dd')
}

export const addDay = (dateObj: Date, addNum: number) => {
  const date = utcToZonedTime(new Date(dateObj), 'Asia/Tokyo')
  return format(addDays(date, addNum), 'yyyy-MM-dd')
}

export const differenceInDates = (start_date: string, end_date: string) => {
  const timeZone = 'Asia/Tokyo'
  const startDate = utcToZonedTime(new Date(start_date), timeZone)
  const endDate = utcToZonedTime(new Date(end_date), timeZone)
  const dayCount = differenceInDays(endDate, startDate) + 1
  return Array.from({ length: dayCount }, (_, i) =>
    format(zonedTimeToUtc(addDays(startDate, i), timeZone), 'yyyy-MM-dd')
  )
}

export const getTimeFromString = (dateStr: string) => {
  const date = utcToZonedTime(new Date(dateStr), 'Asia/Tokyo')
  return format(date, 'HH:mm')
}

export const parseTimeObj = (time: string) => {
  const date = utcToZonedTime(new Date(), 'Asia/Tokyo')
  return parse(time, 'HH:mm', date)
}

export const getOneHourAhead = (time: string): string => {
  const now = utcToZonedTime(new Date(), 'Asia/Tokyo')
  let date = parse(time, 'HH:mm', now)

  if (date.getHours() < 23) {
    date = add(date, { hours: 1 })
  } else {
    date.setMinutes(59)
  }

  return format(date, 'HH:mm')
}

export const getNowTime = () => {
  const now = utcToZonedTime(new Date(), 'Asia/Tokyo')
  return format(now, 'HH:mm')
}

export const differenceInDatesNum = (dateStr1: string, dateStr2: string) => {
  const timeZone = 'Asia/Tokyo'
  const date1 = utcToZonedTime(new Date(dateStr1), timeZone)
  const date2 = utcToZonedTime(new Date(dateStr2), timeZone)
  return differenceInDays(date1, date2)
}
