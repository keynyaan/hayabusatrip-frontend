import React, { useState, useEffect, ChangeEvent, useMemo } from 'react'
import type { DbTripData } from '@/api/tripApi'
import {
  PUBLISH_SETTINGS_ITEMS,
  TRIP_DESTINATION_ITEMS,
} from '@/utils/constants'
import { SelectField } from './SelectField'

type TripFilterProps = {
  dbTripsData: DbTripData[]
  setFilteredData: React.Dispatch<React.SetStateAction<DbTripData[]>>
}

export const TripFilter: React.FC<TripFilterProps> = ({
  dbTripsData,
  setFilteredData,
}) => {
  const [dateFilter, setDateFilter] = useState({ year: '', month: '', day: '' })
  const [destinationFilter, setDestinationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

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

  const handleDateFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDateFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleDestinationFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDestinationFilter(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const getUniqueYears = (trips: DbTripData[]) => {
    return Array.from(
      new Set(trips.map((trip) => new Date(trip.start_date).getFullYear()))
    )
  }

  const getUniqueMonths = (trips: DbTripData[]) => {
    return Array.from(
      new Set(trips.map((trip) => new Date(trip.start_date).getMonth() + 1))
    )
  }

  const getUniqueDays = (trips: DbTripData[]) => {
    return Array.from(
      new Set(
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
    )
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
          items={filteredDestinations}
          search={true}
          onChange={handleDestinationFilterChange}
        />
        <div className="flex space-x-2">
          <SelectField
            id="year"
            labelName="旅行年"
            items={years}
            search={true}
            onChange={handleDateFilterChange}
          />
          <SelectField
            id="month"
            labelName="旅行月"
            items={months}
            search={true}
            onChange={handleDateFilterChange}
          />
          <SelectField
            id="day"
            labelName="旅行日"
            items={days}
            search={true}
            onChange={handleDateFilterChange}
          />
        </div>
        <SelectField
          id="publish-settings"
          labelName="公開状態"
          items={PUBLISH_SETTINGS_ITEMS}
          search={true}
          onChange={handleStatusFilterChange}
        />
      </div>
    </div>
  )
}