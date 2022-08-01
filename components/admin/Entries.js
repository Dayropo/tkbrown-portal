import { useState } from "react"
import useSWR from "swr"
import axios from "axios"
import { timestampToDate } from "../../utils/helpers"
import Swal from "sweetalert2"
import { fetcher } from "../../lib/fetcher"

const Entries = () => {
  const inputStyles =
    "text-black font-normal bg-purple-50 px-4 pt-2 pb-1.5 border-b-2 border-gray-400 w-full placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-none focus:border-purple-600"

  //entries input state and functions
  const [entry, setEntry] = useState({
    date: "",
    client_company: "",
    revenue: "",
    impressions: "",
  })

  //entries input error state
  const [errors, setErrors] = useState({
    date: "",
    company: "",
    revenue: "",
    impressions: "",
  })

  // input validation
  const validate = () => {
    let isValid = true
    setErrors({
      date: "",
      company: "",
      revenue: "",
      impressions: "",
    })

    if (entry?.date) {
      const regEx = /^\d{4}-\d{2}-\d{2}$/

      if (!entry?.date.match(regEx)) {
        isValid = false
        setErrors(prevState => ({
          ...prevState,
          date: "Provide a valid date",
        }))
      }

      const d = new Date(entry?.date)
      const dNum = d.getTime()
      if (!dNum && dNum !== 0) {
        isValid = false
        setErrors(prevState => ({
          ...prevState,
          date: "Provide a valid date",
        }))
      }

      const date = d.toISOString().slice(0, 10)
      if (date) {
        isValid = true
        setErrors(prevState => ({
          ...prevState,
          date: "",
        }))
      }
    } else {
      isValid = false
      setErrors(prevState => ({
        ...prevState,
        date: "This field is required",
      }))
    }

    // if (entry?.client_company) {
    //   const pattern = new RegExp(
    //     /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    //   )
    //   if (pattern.test(entry?.client_company)) {
    //     setErrors(prevState => ({
    //       ...prevState,
    //       company: "",
    //     }))
    //   } else {
    //     isValid = false
    //     setErrors(prevState => ({
    //       ...prevState,
    //       company: "Provide a valid company",
    //     }))
    //   }
    // } else {
    //   isValid = false
    //   setErrors(prevState => ({
    //     ...prevState,
    //     company: "This field is required",
    //   }))
    // }

    if (!entry?.client_company) {
      isValid = false
      setErrors(prevState => ({
        ...prevState,
        revenue: "This field is required",
      }))
    }

    if (!entry?.revenue) {
      isValid = false
      setErrors(prevState => ({
        ...prevState,
        revenue: "This field is required",
      }))
    }

    if (!entry?.impressions) {
      isValid = false
      setErrors(prevState => ({
        ...prevState,
        impressions: "This field is required",
      }))
    }

    return isValid
  }

  const addEntry = async e => {
    e.preventDefault()

    let validation = validate()

    if (validation) {
      const res = await axios
        .post("/api/entries/", {
          posted_at: entry.date,
          client_company: entry.client_company,
          revenue: Number.parseFloat(entry.revenue),
          impressions: Number.parseInt(entry.impressions, 10),
        })
        .catch(err => {
          Swal.fire({
            toast: true,
            icon: "error",
            title: err?.response?.data?.message,
            position: "top",
            timer: 5000,
            showConfirmButton: false,
          })
        })
      if (res?.status === 201) {
        Swal.fire({
          toast: true,
          icon: "success",
          title: res?.data?.message,
          position: "top",
          timer: 5000,
          showConfirmButton: false,
        })
        setEntry({
          date: "",
          client_company: "",
          revenue: "",
          impressions: "",
        })
      }
    }
  }

  const [entryIndex, setEntryIndex] = useState(0)

  const { data: entries, error } = useSWR(
    `/api/entries?index=${entryIndex}`,
    fetcher
  )

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
                onChange={e => {
                  setErrors({
                    date: "",
                    company: "",
                    revenue: "",
                    impressions: "",
                  })
                  setEntry({ ...entry, date: e.target.value })
                }}
              />
              <p className="sm:text-sm text-xs text-red-500 mt-2.5">
                {errors?.date}
              </p>
            </div>
            <div className="w-1/2 pl-4 sm:pr-4 pr-0">
              <input
                type="text"
                id="client"
                placeholder="Client *"
                required
                className={inputStyles}
                value={entry.client_company}
                onChange={e => {
                  setErrors({
                    date: "",
                    company: "",
                    revenue: "",
                    impressions: "",
                  })
                  setEntry({ ...entry, client_company: e.target.value })
                }}
              />
              <p className="sm:text-sm text-xs text-red-500 mt-2.5">
                {errors?.company}
              </p>
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
                onChange={e => {
                  setErrors({
                    date: "",
                    company: "",
                    revenue: "",
                    impressions: "",
                  })
                  setEntry({ ...entry, revenue: e.target.value })
                }}
              />
              <p className="sm:text-sm text-xs text-red-500 mt-2.5">
                {errors?.revenue}
              </p>
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
                onChange={e => {
                  setErrors({
                    date: "",
                    company: "",
                    revenue: "",
                    impressions: "",
                  })
                  setEntry({ ...entry, impressions: e.target.value })
                }}
              />
              <p className="sm:text-sm text-xs text-red-500 mt-2.5">
                {errors?.impressions}
              </p>
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
        {entries && (
          <div className="mt-8 flex flex-col">
            <div className="flex w-full py-3 bg-purple-400 rounded-t-md text-white items-end">
              <span className="w-1/5 text-center sm:text-base text-sm">
                Date
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm">
                Client
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm">
                Revenue
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm">
                Impressions
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm">
                eCPM
              </span>
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
                  {el?.client_company}
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
    </div>
  )
}

export default Entries
