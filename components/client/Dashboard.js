import { useRouter } from "next/router"
import { timestampToDate } from "../../utils/helpers"
import useSWR from "swr"
import axios from "axios"
import { useState } from "react"
import LineChart from "../admin/LineChart"

const Dashboard = ({ user }) => {
  const router = useRouter()
  const { clientId } = router.query

  // dashboard states

  const { data: entries } = useSWR("entries", async () => {
    const res = await axios.get(`/api/entries/${clientId}`).catch(error => {
      console.error(error?.response)
    })
    return res?.data
  })

  const { data: sum } = useSWR("sum", async () => {
    const res = await axios.get(`/api/entries/${clientId}/sum`).catch(error => {
      console.error(error?.response)
    })
    return res?.data
  })

  const eCPM = (sum?.total_revenue / sum?.total_impressions) * 1000

  return (
    <div className="py-4">
      <span className="font-semibold text-lg">{`Welcome, ${user?.email}`}</span>
      {/**summary */}
      <div className="w-full mt-5 py-6 px-8 bg-purple-500 rounded-xl flex flex-wrap item-center justify-between text-white">
        <div>
          <p className="text-xs">Total Revenue</p>
          <p className="sm:text-2xl text-xl">{`${sum?.total_revenue} €`}</p>
        </div>
        <div>
          <p className="text-xs">Total Impressions</p>
          <p className="sm:text-2xl text-xl">{`${sum?.total_impressions}`}</p>
        </div>
        <div>
          <p className="text-xs">eCPM</p>
          <p className="sm:text-2xl text-xl">{eCPM.toFixed(2)}</p>
        </div>
      </div>

      {/**chart */}
      <div className="mt-8">
        <LineChart entries={entries} />
      </div>

      {/**daily input */}
      <div className="mt-8 flex flex-col">
        <div className="flex w-full py-3 bg-purple-300 rounded-t-md text-white items-end">
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
      </div>
    </div>
  )
}

export default Dashboard
