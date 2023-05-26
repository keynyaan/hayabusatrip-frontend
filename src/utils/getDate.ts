import { add } from 'date-fns'
import { format, utcToZonedTime } from 'date-fns-tz'

const nowInJapan = utcToZonedTime(new Date(), 'Asia/Tokyo')
const tomorrowInJapan = add(nowInJapan, { days: 1 })

export const getToday = () => {
  return format(nowInJapan, 'yyyy-MM-dd')
}

export const getTomorrow = () => {
  return format(tomorrowInJapan, 'yyyy-MM-dd')
}

export const getNextDay = (dateStr: string) => {
  const date = utcToZonedTime(new Date(dateStr), 'Asia/Tokyo')
  const nextDay = add(date, { days: 1 })
  return format(nextDay, 'yyyy-MM-dd')
}
