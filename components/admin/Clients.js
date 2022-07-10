import { useState } from "react"
import useSWR from "swr"
import axios from "axios"
import { FiX } from "react-icons/fi"
import Swal from "sweetalert2"
import { fetcher } from "../../lib/fetcher"
import Modal from "./Modal"

const Clients = () => {
  const inputStyles =
    "text-black font-normal bg-purple-50 px-4 pt-2 pb-1.5 border-b-2 border-gray-400 w-full placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-none focus:border-purple-600"
  const [clientIndex, setClientIndex] = useState(0)
  const [selectedId, setSelectedId] = useState("")

  const { data, error } = useSWR(`/api/clients?index=${clientIndex}`, fetcher)

  if (error) {
    console.error(error.response.message)
  }

  // client input state
  const [client, setClient] = useState({
    email: "",
    company: "",
  })

  const addClient = async e => {
    e.preventDefault()
    const res = await axios
      .post("/api/clients/", {
        email: client.email,
        company: client.company,
      })
      .catch(err => {
        Swal.fire({
          toast: true,
          icon: "error",
          title: err?.response?.data?.message,
          position: "top",
          showConfirmButton: false,
          timer: 5000,
        })
      })
    if (res?.data) {
      Swal.fire({
        title: "New client added successfully",
        html: `<b>Client Details</b> <br />
        Email: ${res?.data?.email} <br />
        Company: ${res?.data?.company} <br/>
        Password: ${res?.data?.password}
        `,
        allowOutsideClick: false,
      })
    }
  }

  return (
    <div className="py-4 relative">
      {selectedId && (
        <Modal selectedId={selectedId} setSelectedId={setSelectedId} />
      )}
      <span className="font-semibold text-lg">Add a new Client</span>
      {/**add client form */}
      <form className="w-full mt-8">
        <div className="w-full flex">
          <div className="w-1/2 pr-4">
            <input
              type="text"
              id="email"
              placeholder="Email Address *"
              required
              autoComplete="off"
              className={inputStyles}
              value={client.email}
              onChange={e => {
                setClient({ ...client, email: e.target.value })
              }}
            />
          </div>
          <div className="w-1/2 pl-4">
            <input
              type="text"
              id="company"
              placeholder="Company Name *"
              required
              autoComplete="off"
              className={inputStyles}
              value={client.company}
              onChange={e => {
                setClient({ ...client, company: e.target.value })
              }}
            />
          </div>
        </div>
        <button
          className="mt-8 bg-purple-500 text-white py-2 px-6 rounded text-sm"
          onClick={e => addClient(e)}
        >
          ADD CLIENT
        </button>
      </form>

      {/**view clients */}
      <div className="py-4 mt-8">
        <span className="font-semibold text-lg">Clients</span>
        {data && (
          <div className="mt-8 flex flex-col">
            <div className="flex sm:w-2/3 w-full py-3 bg-purple-400 rounded-t-md text-white items-end">
              <span className="w-1/2 text-center sm:text-base text-sm px-2.5">
                Email
              </span>
              <span className="w-1/2 text-center sm:text-base text-sm px-2.5">
                Company Name
              </span>
            </div>

            {/**client mapping */}
            {data?.map((client, index) => (
              <div
                className={`${
                  index === data.length - 1 ? "rounded-b-md" : null
                } flex sm:w-2/3 w-full py-3 bg-white text-black items-center divide-x-1 divide-black`}
                key={client?.id}
                onClick={() => setSelectedId(client?.id)}
              >
                <span className="w-1/2 text-center sm:text-base text-sm px-2.5 break-words">
                  {client?.email}
                </span>
                <span className="w-1/2 text-center sm:text-base text-sm px-2.5 break-words">
                  {client?.company}
                </span>
              </div>
            ))}

            <div
              className={`${
                clientIndex ? "justify-between" : "justify-end"
              } sm:w-2/3 w-full flex items-center bg-white py-2.5 px-4`}
            >
              <button
                className={`${
                  clientIndex ? "flex" : "hidden"
                } bg-purple-400 text-white py-1.5 px-6 rounded-2xl`}
                onClick={() => setClientIndex(clientIndex - 1)}
              >
                Prev
              </button>
              <button
                className={`${
                  data?.length < 5 ? "hidden" : "flex"
                } bg-purple-400 text-white py-1.5 px-6 rounded-2xl`}
                onClick={() => setClientIndex(clientIndex + 1)}
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

export default Clients
