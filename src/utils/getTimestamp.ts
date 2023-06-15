import { format, utcToZonedTime } from 'date-fns-tz'

export const getTimestamp = () => {
  const nowInJapan = utcToZonedTime(new Date(), 'Asia/Tokyo')
  return format(nowInJapan, 'yyyyMMddHHmmssSSS')
}

export const getDatetimeTimestamp = () => {
  const nowInJapan = utcToZonedTime(new Date(), 'Asia/Tokyo')
  return format(nowInJapan, 'yyyy-MM-dd HH:mm:ss.SSS')
}
