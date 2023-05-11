import { format, utcToZonedTime } from 'date-fns-tz'

export const getTimestamp = () => {
  return format(utcToZonedTime(new Date(), 'Asia/Tokyo'), 'yyyyMMddHHmmss')
}
