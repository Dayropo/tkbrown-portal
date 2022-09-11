import { formatDate, timestampToDate, trimDate } from "../../utils/helpers"
import useSWR from "swr"
import axios from "axios"
import { useState } from "react"
import LineChart from "../client/LineChart"
import { fetcher } from "../../lib/fetcher"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { MdAddchart, MdContactSupport } from "react-icons/md"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"
import DatePicker from "react-datepicker"
import { DateRangePicker } from "react-date-range"
import {
  addDays,
  endOfWeek,
  startOfWeek,
  format,
  startOfMonth,
  addMonths,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns"

import "react-date-range/dist/styles.css" // main css file
import "react-date-range/dist/theme/default.css" // theme css file
import "react-datepicker/dist/react-datepicker.css"
import { defaultStaticRanges } from "../DateRange"

const Dashboard = ({ user, company }) => {
  const inputStyles = `text-black font-normal bg-purple-50 lg:w-1/4 sm:w-1/3 w-1/2 mr-6 px-4 sm:pt-2 pt-4 pb-1.5 border-b-2 border-gray-400 w-full placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-none focus:border-purple-600`

  // const [entryIndex, setEntryIndex] = useState(0)
  const [time, setTime] = useState("last-7d")
  const [option, setOption] = useState("last-7d")
  const [startDate, setStartDate] = useState(
    format(startOfDay(addDays(new Date(), -6)), "yyyy-MM-dd")
  )
  const [endDate, setEndDate] = useState(
    format(endOfDay(new Date()), "yyyy-MM-dd")
  )
  const [showPicker, setShowPicker] = useState(false)

  const [dates, setDates] = useState([
    {
      startDate: startOfWeek(new Date()),
      endDate: endOfWeek(new Date()),
      key: "selection",
    },
  ])

  console.log({
    dates: dates,
    startfns: format(dates[0].startDate, "yyyy-MM-dd"),
    endfns: format(dates[0].endDate, "yyyy-MM-dd"),
  })

  console.log({ startDate, endDate })

  // dashboard states

  //get data for jumbo
  // const { data: sum, error: sumError } = useSWR(
  //   `/api/entries/sum/${time}?email=${user?.email}&company=${company}`,
  //   fetcher
  // )
  const { data: sum, error: sumError } = useSWR(
    `/api/entries/sum/range?email=${user?.email}&company=${company}&from=${startDate}&to=${endDate}`,
    fetcher
  )

  const eCPM = (sum?.total_revenue / sum?.total_impressions) * 1000

  //get data for chart
  // const { data: chart, error: chartError } = useSWR(
  //   `/api/entries/client/chart/${time}?company=${company}&from=${startDate}&to=${endDate}`,
  //   fetcher
  // )
  const { data: chart, error: chartError } = useSWR(
    `/api/entries/client/chart/range?company=${company}&from=${startDate}&to=${endDate}`,
    fetcher
  )

  const slicedChart = chart?.slice(-30)

  //get data for entries
  // const { data: entries, error: entriesError } = useSWR(
  //   `/api/entries/client/${time}?company=${company}`,
  //   fetcher
  // )

  if (sum && chart) {
    return (
      <div className="py-4">
        <span className="font-semibold text-lg">{`Welcome, ${company}`}</span>
        {/**summary */}

        <div className="flex flex-wrap relative items-center mt-2.5 ">
          <button
            className={`${
              option === "last-7d"
                ? "bg-purple-500 text-white"
                : "border border-purple-500 text-purple-500"
            } py-1.5 px-6 md:w-auto w-2/5 rounded-md text-sm font-medium mr-4`}
            onClick={() => {
              setOption("last-7d")
              // setTime("last-7d")
              setStartDate(
                format(startOfDay(addDays(new Date(), -6)), "yyyy-MM-dd")
              )
              setEndDate(format(endOfDay(new Date()), "yyyy-MM-dd"))
              setShowPicker(false)
            }}
          >
            LAST 7 DAYS
          </button>
          <button
            className={`${
              option === "last-month"
                ? "bg-purple-500 text-white"
                : "border border-purple-500 text-purple-500"
            } py-1.5 px-6 md:w-auto w-2/5  rounded-md text-sm font-medium mr-4`}
            onClick={() => {
              setOption("last-month")
              // setTime("last-month")
              setStartDate(
                format(startOfMonth(addMonths(new Date(), -1)), "yyyy-MM-dd")
              )
              setEndDate(
                format(endOfMonth(addMonths(new Date(), -1)), "yyyy-MM-dd")
              )
              setShowPicker(false)
            }}
          >
            LAST MONTH
          </button>
          <button
            className={`${
              option === "this-month"
                ? "bg-purple-500 text-white"
                : "border border-purple-500 text-purple-500"
            } py-1.5 px-6 md:w-auto w-2/5 md:mt-0 mt-2 rounded-md text-sm font-medium mr-4`}
            onClick={() => {
              setOption("this-month")
              // setTime("this-month")
              setStartDate(format(startOfMonth(new Date()), "yyyy-MM-dd"))
              setEndDate(format(endOfMonth(new Date()), "yyyy-MM-dd"))
              setShowPicker(false)
            }}
          >
            THIS MONTH
          </button>
          <button
            className={`${
              option === "all"
                ? "bg-purple-500 text-white"
                : "border border-purple-500 text-purple-500"
            } py-1.5 px-6 md:w-auto w-2/5 md:mt-0 mt-2 rounded-md text-sm font-medium mr-4`}
            onClick={() => {
              setOption("all")
              // setTime("all")
              setStartDate("2022-01-01")
              setEndDate(format(endOfWeek(new Date()), "yyyy-MM-dd"))
              setShowPicker(false)
            }}
          >
            ALL HISTORY
          </button>
          <button
            className={`${
              option === "custom"
                ? "bg-purple-500 text-white"
                : "border border-purple-500 text-purple-500"
            } py-1.5 px-6 md:w-auto w-2/5 xl:mt-0 mt-2 rounded-md md:text-sm text-xs font-medium flex items-center`}
            onClick={() => {
              setOption("custom")
              setShowPicker(!showPicker)
            }}
          >
            <p>CUSTOM PERIOD</p>
            {showPicker ? (
              <FiChevronUp size={16} className="ml-2 font-medium" />
            ) : (
              <FiChevronDown size={16} className="ml-2 font-medium" />
            )}
          </button>

          {/**filter */}
          {showPicker && (
            <div className="absolute lg:top-12 sm:top-20 top-32 z-50 bg-white flex flex-col md:w-auto w-full">
              <DateRangePicker
                onChange={item => setDates([item.selection])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={dates}
                direction="horizontal"
                staticRanges={defaultStaticRanges}
                inputRanges={[]}
              />
              <div className="flex justify-end p-4">
                <button
                  className="bg-blu text-white text-sm font-medium py-1.5 px-6 rounded-xl"
                  onClick={() => {
                    setStartDate(format(dates[0].startDate, "yyyy-MM-dd"))
                    setEndDate(format(dates[0].endDate, "yyyy-MM-dd"))
                    setShowPicker(false)
                  }}
                >
                  APPLY
                </button>
              </div>
            </div>
          )}
        </div>

        {chart?.length > 0 ? (
          <div>
            <div className="w-full mt-5 flex flex-wrap item-center text-white">
              <div className="bg-purple-500 py-4 lg:px-16 px-8 md:mr-8 mr-4 mb-2.5 rounded-xl">
                <p className="text-xs">Revenue</p>
                <p className="sm:text-2xl text-xl font-medium">{`${
                  sum?.total_revenue ? `${sum?.total_revenue} €` : ""
                }`}</p>
              </div>
              <div className="bg-purple-500 py-4 lg:px-16 px-8 md:mr-8 mr-4 mb-2.5 rounded-xl">
                <p className="text-xs">Impressions</p>
                <p className="sm:text-2xl text-xl font-medium">{`${
                  sum?.total_impressions ? sum?.total_impressions : ""
                }`}</p>
              </div>
              <div className="bg-purple-500 py-4 lg:px-16 px-8 mb-2.5 rounded-xl">
                <p className="text-xs">eCPM</p>
                <p className="sm:text-2xl text-xl font-medium">{`${
                  eCPM ? eCPM.toFixed(2) : ""
                }`}</p>
              </div>
            </div>

            {/**chart */}
            {chart?.length > 31 ? (
              <div className="mt-8 bg-white p-4 rounded-lg relative w-full h-[50vh]">
                <LineChart entries={slicedChart} />
              </div>
            ) : (
              <div className="mt-8 bg-white p-4 rounded-lg relative w-full h-[50vh]">
                <LineChart entries={chart} />
              </div>
            )}

            {/**daily input */}

            {/* <div className="mt-8 flex flex-col">
              <div className="flex w-full py-3 bg-purple-400 rounded-t-md text-white items-end">
                <span className="w-1/4 text-center sm:text-base text-sm">
                  Date
                </span>
                <span className="w-1/4 text-center sm:text-base text-sm">
                  Revenue
                </span>
                <span className="w-1/4 text-center sm:text-base text-sm">
                  Impressions
                </span>
                <span className="w-1/4 text-center sm:text-base text-sm">
                  eCPM
                </span>
              </div>

              {entries?.map((entry, index) => (
                <div
                  key={index}
                  className={`${
                    index === entries.length - 1 ? "rounded-b-md" : null
                  } flex w-full py-3 bg-white text-black items-center`}
                >
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    {entry?.posted_at}
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    {entry?.revenue}
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    {entry?.impressions}
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    {entry?.eCPM}
                  </span>
                </div>
              ))}
            </div> */}
          </div>
        ) : (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="text-center">
              <MdAddchart size={200} className="text-purple-500" />
              <p className="font-medium text-gray-400">No data collected</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="w-full mt-5 py-6">
        <Skeleton height={100} />
      </div>

      <div className="mt-8">
        <Skeleton height={360} />
      </div>

      {/* <div className="mt-8 flex flex-col">
        <Skeleton height={250} />
      </div> */}
    </div>
  )
}

export default Dashboard
