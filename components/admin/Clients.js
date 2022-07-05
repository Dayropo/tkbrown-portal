import { useState } from "react"
import useSWR from "swr"
import axios from "axios"

const Modal = ({ setShowModal, newClient }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      {/**modal content */}
      <div className="relative top-20 mx-auto p-5 border lg:w-1/2 sm:w-3/5 w-full shadow-xl rounded-md bg-white text-black">
        <button
          className="absolute -top-3 -right-3 bg-white rounded-full shadow-lg p-2.5 text-sm text-center text-black"
          onClick={() => setShowModal(false)}
        >
          <FiX size={16} />
        </button>

        <span className="text-lg font-semibold">Client Details</span>
        <div className="mt-8">
          <p>{`email: ${newClient?.email}`}</p>
          <p>{`company: ${newClient?.company}`}</p>
          <p>{`password: ${newClient?.password}`}</p>
        </div>
      </div>
    </div>
  )
}

const Clients = () => {
  const inputStyles =
    "text-black font-normal bg-purple-50 px-4 pt-2 pb-1.5 border-b-2 border-gray-400 w-full placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-none focus:border-purple-600"

  const { data } = useSWR("clients", async () => {
    const res = await axios.get("/api/clients/").catch(error => {
      console.error(error?.response)
    })
    console.log(res)
    return res?.data
  })

  //new client state
  const [showModal, setShowModal] = useState(false)
  const [newClient, setNewClient] = useState({})

  // client input state
  const [client, setClient] = useState({
    email: "",
    company: "",
  })

  const addClient = async e => {
    e.preventDefault()
    const res = await axios
      .post(
        "/api/clients/",
        {
          email: client.email,
          company: client.company,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .catch(err => console.error(err?.response))
    if (res) {
      setNewClient(res?.data)
      setShowModal(true)
    }
  }

  return (
    <div className="py-4 relative">
      {/**new client modal */}
      {showModal && <Modal setShowModal={setShowModal} newClient={newClient} />}

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
        <div className="mt-8 flex flex-col">
          <div className="flex sm:w-2/3 w-full py-3 bg-purple-300 rounded-t-md text-white items-end">
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
            >
              <span className="w-1/2 text-center sm:text-base text-sm px-2.5 break-words">
                {client?.email}
              </span>
              <span className="w-1/2 text-center sm:text-base text-sm px-2.5 break-words">
                {client?.company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Clients
