import { format, utcToZonedTime } from 'date-fns-tz'

const nowInJapan = utcToZonedTime(new Date(), 'Asia/Tokyo')

export const getTimestamp = () => {
  return format(nowInJapan, 'yyyyMMddHHmmss')
}

export const getDatetimeTimestamp = () => {
  return format(nowInJapan, 'yyyy-MM-dd HH:mm:ss.SSS')
}
