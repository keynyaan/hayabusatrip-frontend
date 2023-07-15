import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemState,
} from 'react-accessible-accordion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { useAuthContext } from '@/context/AuthContext'
import { COST_CATEGORY_OPTIONS } from '@/utils/constants'
import { getJapaneseDay } from '@/utils/getDate'
import { DbSpotData } from '@/api/spotApi'

type TripCostProps = {
  tripDates: string[]
  getSpotsForDate: (date: string, items?: string[]) => DbSpotData[] | undefined
}

export const TripCost: React.FC<TripCostProps> = ({
  tripDates,
  getSpotsForDate,
}) => {
  const { dbSpotsData } = useAuthContext()

  const getTotalCost = (items: string[]): number => {
    let totalCost = 0
    if (dbSpotsData) {
      for (const spot of dbSpotsData) {
        if (items.includes(spot.spot_icon)) {
          totalCost += spot.cost
        }
      }
    }
    return totalCost
  }

  return (
    <div className="px-4 max-w-xs mx-auto">
      <Accordion allowZeroExpanded>
        {COST_CATEGORY_OPTIONS.map((option, i) => (
          <React.Fragment key={i}>
            {option.value === 'total' && (
              <hr className="border-t-1 my-2 border-gray-300" />
            )}
            <AccordionItem key={i}>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <div className={`flex items-center justify-between p-4 `}>
                    <div className="flex items-center space-x-4">
                      <AccordionItemState>
                        {({ expanded }) => (
                          <FontAwesomeIcon
                            icon={expanded ? faAngleUp : faAngleDown}
                            className="text-xs sm:text-sm text-gray-500"
                          />
                        )}
                      </AccordionItemState>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`flex w-6 h-6 items-center justify-center`}
                        >
                          <FontAwesomeIcon
                            icon={option.icon}
                            size="xl"
                            className={option.textColor}
                          />
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 shrink-0 w-12 text-right">
                          {option.label}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 w-24 text-right">
                      ¥{getTotalCost(option.items)}
                    </p>
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div
                  className={`text-gray-700 text-xs sm:text-sm p-4 rounded-xl space-y-2 ${option.bgColor}`}
                >
                  <p className="text-center">【内訳】</p>
                  {tripDates.map((date, i) => {
                    const spotsForDate = getSpotsForDate(date, option.items)
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-center space-x-2">
                          <p>{`${i + 1}日目`}</p>
                          <p> {getJapaneseDay(date)}</p>
                        </div>
                        <div className="space-y-1">
                          {spotsForDate?.map((spot, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between space-x-2"
                            >
                              <p>{spot.title}</p>
                              <p className="shrink-0 w-18 text-right">
                                ¥{spot.cost}
                              </p>
                            </div>
                          ))}
                          {spotsForDate?.length === 0 && (
                            <p className="text-center">なし</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </AccordionItemPanel>
            </AccordionItem>
          </React.Fragment>
        ))}
      </Accordion>
    </div>
  )
}
