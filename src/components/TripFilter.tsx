import React, { useEffect, useMemo } from 'react'
import type { DbTripData } from '@/api/tripApi'
import { SelectField } from '@/components/SelectField'
import { useAuthContext } from '@/context/AuthContext'
import {
  PUBLISH_SETTINGS_ITEMS,
  TRIP_DESTINATION_ITEMS,
} from '@/utils/constants'

type TripFilterProps = {
  dbTripsData: DbTripData[]
}

export const TripFilter: React.FC<TripFilterProps> = ({ dbTripsData }) => {
  const {
    dateFilter,
    destinationFilter,
    statusFilter,
    handleDateFilterChange,
    handleDestinationFilterChange,
    handleStatusFilterChange,
    setFilteredData,
  } = useAuthContext()

  useEffect(() => {
    let filtered = [...dbTripsData]

    if (dateFilter.year || dateFilter.month || dateFilter.day) {
      filtered = filtered.filter((trip) => {
        const startDate = new Date(trip.start_date)
        const endDate = new Date(trip.end_date)

        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          if (
            (!dateFilter.year ||
              d.getFullYear().toString() === dateFilter.year) &&
            (!dateFilter.month ||
              (d.getMonth() + 1).toString() === dateFilter.month) &&
            (!dateFilter.day || d.getDate().toString() === dateFilter.day)
          ) {
            return true
          }
        }

        return false
      })
    }

    if (destinationFilter) {
      filtered = filtered.filter(
        (trip) => String(trip.prefecture_id) === destinationFilter
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (trip) => String(trip.is_public) === statusFilter
      )
    }

    setFilteredData(filtered)
  }, [
    dateFilter,
    destinationFilter,
    statusFilter,
    dbTripsData,
    setFilteredData,
  ])

  const getUniqueYears = (trips: DbTripData[]) => {
    const yearsSet = new Set(
      trips.map((trip) => new Date(trip.start_date).getFullYear())
    )
    return Array.from(yearsSet).sort((a, b) => a - b)
  }

  const getUniqueMonths = (trips: DbTripData[]) => {
    const monthsSet = new Set(
      trips.map((trip) => new Date(trip.start_date).getMonth() + 1)
    )
    return Array.from(monthsSet).sort((a, b) => a - b)
  }

  const getUniqueDays = (trips: DbTripData[]) => {
    const daysSet = new Set(
      trips.flatMap((trip) => {
        const days = []
        for (
          let d = new Date(trip.start_date);
          d <= new Date(trip.end_date);
          d.setDate(d.getDate() + 1)
        ) {
          days.push(d.getDate())
        }
        return days
      })
    )
    return Array.from(daysSet).sort((a, b) => a - b)
  }

  const getUniqueDestinations = (trips: DbTripData[]) => {
    return Array.from(new Set(trips.map((trip) => trip.prefecture_id)))
  }

  const years = useMemo(() => getUniqueYears(dbTripsData), [dbTripsData])
  const months = useMemo(() => getUniqueMonths(dbTripsData), [dbTripsData])
  const days = useMemo(() => getUniqueDays(dbTripsData), [dbTripsData])
  const destinations = useMemo(
    () => getUniqueDestinations(dbTripsData),
    [dbTripsData]
  )
  const filteredDestinations = TRIP_DESTINATION_ITEMS.filter((item) =>
    destinations.includes(Number(item.value))
  )

  return (
    <div className="flex justify-center">
      <div className="space-y-2 max-w-xs">
        <SelectField
          id="destinations"
          labelName="旅行先"
          value={destinationFilter}
          items={filteredDestinations}
          search={true}
          onChange={handleDestinationFilterChange}
        />
        <div className="flex space-x-2">
          <SelectField
            id="year"
            labelName="旅行年"
            value={dateFilter.year}
            items={years}
            search={true}
            onChange={handleDateFilterChange}
          />
          <SelectField
            id="month"
            labelName="旅行月"
            value={dateFilter.month}
            items={months}
            search={true}
            onChange={handleDateFilterChange}
          />
          <SelectField
            id="day"
            labelName="旅行日"
            value={dateFilter.day}
            items={days}
            search={true}
            onChange={handleDateFilterChange}
          />
        </div>
        <SelectField
          id="publish-settings"
          value={statusFilter}
          labelName="公開状態"
          items={PUBLISH_SETTINGS_ITEMS}
          search={true}
          onChange={handleStatusFilterChange}
        />
      </div>
    </div>
  )
}
