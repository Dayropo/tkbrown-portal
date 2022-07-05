import { useState } from "react"
import useSWR from "swr"
import axios from "axios"
import { timestampToDate } from "../../utils/helpers"

const Entries = () => {
  const inputStyles =
    "text-black font-normal bg-purple-50 px-4 pt-2 pb-1.5 border-b-2 border-gray-400 w-full placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-none focus:border-purple-600"

  //entries input state and functions
  const [entry, setEntry] = useState({
    date: "",
    client_email: "",
    revenue: "",
    impressions: "",
  })

  const addEntry = async e => {
    e.preventDefault()
    const res = await axios
      .post("/api/entries/", {
        posted_at: entry.date,
        client_email: entry.client_email,
        revenue: Number.parseFloat(entry.revenue),
        impressions: Number.parseInt(entry.impressions, 10),
      })
      .catch(err => console.error(err?.response))
    if (res?.status === 201) {
      setEntry({
        date: "",
        client_email: "",
        revenue: "",
        impressions: "",
      })
    }
  }

  const { data: entries } = useSWR("entries", async () => {
    const res = await axios.get("/api/entries/").catch(error => {
      console.error(error?.response)
    })

    return res?.data
  })

  return (
    <div className="py-4">
      <span className="font-semibold text-lg">Add a new Entry</span>
      {/**add entry form */}

      <form className="w-full mt-8">
        <div className="w-full flex sm:flex-row flex-col sm:space-y-0 space-y-6">
          <div className="sm:w-1/2 w-full flex">
            <div className="w-1/2 pr-4">
              <input
                type="date"
                id="date"
                placeholder="Date *"
                required
                className={inputStyles}
                value={entry.date}
                onChange={e => setEntry({ ...entry, date: e.target.value })}
              />
            </div>
            <div className="w-1/2 pl-4 sm:pr-4 pr-0">
              <input
                type="text"
                id="client"
                placeholder="Client *"
                required
                className={inputStyles}
                value={entry.client_email}
                onChange={e =>
                  setEntry({ ...entry, client_email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="sm:w-1/2 w-full flex">
            <div className="w-1/2 sm:pl-4 pl-0 pr-4">
              <input
                type="number"
                id="revenue"
                placeholder="Revenue *"
                required
                autoComplete="off"
                className={inputStyles}
                value={entry.revenue}
                onChange={e => setEntry({ ...entry, revenue: e.target.value })}
              />
            </div>
            <div className="w-1/2 pl-4">
              <input
                type="number"
                id="impression"
                placeholder="Impressions *"
                required
                autoComplete="off"
                className={inputStyles}
                value={entry.impressions}
                onChange={e =>
                  setEntry({ ...entry, impressions: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <button
          className="mt-8 bg-purple-500 text-white py-2 px-6 rounded text-sm"
          onClick={e => addEntry(e)}
        >
          ADD ENTRY
        </button>
      </form>

      {/**view clients */}
      <div className="py-4 mt-8">
        <span className="font-semibold text-lg">Entries</span>
        <div className="mt-8 flex flex-col">
          <div className="flex w-full py-3 bg-purple-300 rounded-t-md text-white items-end">
            <span className="w-1/5 text-center sm:text-base text-sm">Date</span>
            <span className="w-1/5 text-center sm:text-base text-sm">
              Client
            </span>
            <span className="w-1/5 text-center sm:text-base text-sm">
              Revenue
            </span>
            <span className="w-1/5 text-center sm:text-base text-sm">
              Impressions
            </span>
            <span className="w-1/5 text-center sm:text-base text-sm">eCPM</span>
          </div>
          {/**entry mapping */}
          {entries?.map((el, index) => (
            <div
              key={index}
              className={`${
                index === entries?.length - 1 ? "rounded-b-md" : null
              } flex w-full py-3 bg-white text-black items-center`}
            >
              <span className="w-1/5 text-center sm:text-base text-sm px-2.5">
                {el?.posted_at}
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm px-2.5 break-words">
                {el?.client_email}
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm px-2.5">
                {el?.revenue}
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm px-2.5">
                {el?.impressions}
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm px-2.5">
                {el?.eCPM}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Entries