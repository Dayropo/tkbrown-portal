import { timestampToDate } from "../../utils/helpers"
import useSWR from "swr"
import axios from "axios"
import { useState } from "react"
import LineChart from "../admin/LineChart"
import { fetcher } from "../../lib/fetcher"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const Dashboard = ({ user, company }) => {
  // const [entryIndex, setEntryIndex] = useState(0)
  const [time, setTime] = useState("last-7d")

  // dashboard states

  //get data for jumbo
  const { data: sum, error: sumError } = useSWR(
    `/api/entries/sum/${time}?email=${user?.email}&company=${company}`,
    fetcher
  )

  const eCPM = (sum?.total_revenue / sum?.total_impressions) * 1000

  //get data for chart
  const { data: chart, error: chartError } = useSWR(
    `/api/entries/client/chart/${time}?company=${company}`,
    fetcher
  )
  const slicedChart = chart?.slice(-30)

  //get data for entries
  const { data: entries, error: entriesError } = useSWR(
    `/api/entries/client/${time}?company=${company}`,
    fetcher
  )

  if (sum && chart && entries) {
    return (
      <div className="py-4">
        <span className="font-semibold text-lg">{`Welcome, ${company}`}</span>
        {/**summary */}

        <div className="flex flex-wrap items-center mt-2.5 ">
          <button
            className={`${
              time === "last-7d"
                ? "bg-purple-500 text-white"
                : "border border-purple-500 text-purple-500"
            } py-1.5 px-6 md:w-auto w-2/5 rounded-md text-sm font-medium mr-4`}
            onClick={() => setTime("last-7d")}
          >
            LAST 7 DAYS
          </button>
          <button
            className={`${
              time === "last-month"
                ? "bg-purple-500 text-white"
                : "border border-purple-500 text-purple-500"
            } py-1.5 px-6 md:w-auto w-2/5  rounded-md text-sm font-medium mr-4`}
            onClick={() => setTime("last-month")}
          >
            LAST MONTH
          </button>
          <button
            className={`${
              time === "this-month"
                ? "bg-purple-500 text-white"
                : "border border-purple-500 text-purple-500"
            } py-1.5 px-6 md:w-auto w-2/5 md:mt-0 mt-1.5 rounded-md text-sm font-medium mr-4`}
            onClick={() => setTime("this-month")}
          >
            THIS MONTH
          </button>
          <button
            className={`${
              time === "all"
                ? "bg-purple-500 text-white"
                : "border border-purple-500 text-purple-500"
            } py-1.5 px-6 md:w-auto w-2/5 md:mt-0 mt-1.5 rounded-md text-sm font-medium`}
            onClick={() => setTime("all")}
          >
            ALL HISTORY
          </button>
        </div>

        {chart?.length > 0 && entries?.length > 0 ? (
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

            <div className="mt-8 bg-white p-4 rounded-lg relative w-full">
              <LineChart entries={slicedChart} />
            </div>

            {/**daily input */}

            <div className="mt-8 flex flex-col">
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
              {/**records mapping */}
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

              {/* <div
            className={`${
              entryIndex ? "justify-between" : "justify-end"
            } w-full flex items-center bg-white py-2.5 px-4`}
          >
            <button
              className={`${
                entryIndex ? "flex" : "hidden"
              } bg-purple-400 text-white py-1.5 px-6 rounded-2xl`}
              onClick={() => setEntryIndex(entryIndex - 1)}
            >
              Prev
            </button>
            <button
              className={`${
                entries?.length < 7 ? "hidden" : "flex"
              } bg-purple-400 text-white py-1.5 px-6 rounded-2xl`}
              onClick={() => setEntryIndex(entryIndex + 1)}
            >
              Next
            </button>
          </div> */}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div></div>
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

      <div className="mt-8 flex flex-col">
        <Skeleton height={250} />
      </div>
    </div>
  )
}

export default Dashboard
