import { useRouter } from "next/router"
import { timestampToDate } from "../../utils/helpers"
import useSWR from "swr"
import axios from "axios"
import { useState } from "react"
import LineChart from "../admin/LineChart"
import { fetcher } from "../../lib/fetcher"

const Dashboard = ({ user }) => {
  const router = useRouter()
  const { clientId } = router.query

  const [entryIndex, setEntryIndex] = useState(0)

  // dashboard states

  //get data for entries
  const { data: entries, error: entriesError } = useSWR(
    `/api/entries/${clientId}?index=${entryIndex}`,
    fetcher
  )

  //get data for chart
  const { data: chart, error: chartError } = useSWR(
    `/api/entries/${clientId}`,
    fetcher
  )
  const slicedChart = chart?.slice(-30)

  //get data for jumbo
  const { data: sum, error: sumError } = useSWR(
    `/api/entries/${clientId}/sum`,
    fetcher
  )

  const eCPM = (sum?.total_revenue / sum?.total_impressions) * 1000

  return (
    <div className="py-4">
      <span className="font-semibold text-lg">{`Welcome, ${user?.email}`}</span>
      {/**summary */}
      {sum && (
        <div className="w-full mt-5 py-6 px-8 bg-purple-500 rounded-xl flex flex-wrap item-center justify-between text-white">
          <div>
            <p className="text-xs">Total Revenue</p>
            <p className="sm:text-2xl text-xl">{`${
              sum?.total_revenue ? `${sum?.total_revenue} €` : ""
            }`}</p>
          </div>
          <div>
            <p className="text-xs">Total Impressions</p>
            <p className="sm:text-2xl text-xl">{`${
              sum?.total_impressions ? sum?.total_impressions : ""
            }`}</p>
          </div>
          <div>
            <p className="text-xs">eCPM</p>
            <p className="sm:text-2xl text-xl">{`${
              eCPM ? eCPM.toFixed(2) : ""
            }`}</p>
          </div>
        </div>
      )}

      {/**chart */}
      {chart && (
        <div className="mt-8">
          <LineChart entries={slicedChart} />
        </div>
      )}

      {/**daily input */}
      {entries && (
        <div className="mt-8 flex flex-col">
          <div className="flex w-full py-3 bg-purple-400 rounded-t-md text-white items-end">
            <span className="w-1/4 text-center sm:text-base text-sm">Date</span>
            <span className="w-1/4 text-center sm:text-base text-sm">
              Revenue
            </span>
            <span className="w-1/4 text-center sm:text-base text-sm">
              Impressions
            </span>
            <span className="w-1/4 text-center sm:text-base text-sm">eCPM</span>
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

          <div
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
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
