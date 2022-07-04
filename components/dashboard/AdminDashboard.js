import AdminSidebar from "../sidebar/AdminSidebar"
import { FaUserCircle, FaUser } from "react-icons/fa"
import { FiLogOut, FiX, FiMenu } from "react-icons/fi"
import { useContext, useEffect, useState } from "react"
import { SidebarContext } from "../../context/SidebarContext"
import { useRouter } from "next/router"
import axios from "axios"
import useSWR from "swr"
import { AuthContext } from "../../context/AuthContext"
import { timestampToDate } from "../../utils/helpers"

const Menu = () => {
  const router = useRouter()

  return (
    <div className="origin-top-right absolute top-0 right-0 mt-14 mr-6 sm:w-48 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
      <div className="flex flex-col py-4">
        <span
          className="flex items-center justify-between py-3 px-6 cursor-pointer hover:bg-purple-100"
          onClick={() => router.push("/")}
        >
          <FiLogOut />
          <p className="sm:text-base text-sm">Sign Out</p>
        </span>
      </div>
    </div>
  )
}

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

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState("clients")

  const { showAdminSidebar, setShowAdminSidebar } = useContext(SidebarContext)
  const { auth } = useContext(AuthContext)

  //fetch clients
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

  //entries input state and functions
  const [entry, setEntry] = useState({
    client_email: "",
    revenue: "",
    impressions: "",
  })

  const addEntry = async e => {
    e.preventDefault()
    const res = await axios
      .post(
        "/api/entries/",
        {
          client_email: entry.client_email,
          revenue: Number.parseFloat(entry.revenue),
          impressions: Number.parseInt(entry.impressions, 10),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .catch(err => console.error(err?.response))
    if (res) {
      console.log(res?.data)
    }
  }

  const { data: entries } = useSWR("entries", async () => {
    const res = await axios.get("/api/entries/").catch(error => {
      console.error(error?.response)
    })
    console.log(res)
    return res?.data
  })

  //form styles
  const inputStyles =
    "text-black font-normal bg-purple-50 px-4 pt-2 pb-1.5 border-b-2 border-gray-400 w-full placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-none focus:border-purple-600"

  return (
    <div className="relative min-h-screen lg:w-4/5 ml-auto">
      <AdminSidebar tab={tab} setTab={setTab} />

      <nav className="flex justify-end items-center h-12 px-8">
        <span
          className="flex items-center cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen)
          }}
        >
          <FaUserCircle size={16} className="sm:mr-2 mr-0" />
          <p className="sm:block hidden">{auth?.email}</p>
        </span>
        <div className="lg:hidden flex ml-2.5">
          {showAdminSidebar ? (
            <FiX size={16} onClick={() => setShowAdminSidebar(false)} />
          ) : (
            <FiMenu size={16} onClick={() => setShowAdminSidebar(true)} />
          )}
        </div>
        {isOpen && <Menu setTab={setTab} setIsOpen={setIsOpen} />}
      </nav>

      <main className="sm:px-16 sm:py-10 px-4 py-2.5">
        {tab === "clients" && (
          <div className="py-4 relative">
            {/**new client modal */}
            {showModal && (
              <Modal setShowModal={setShowModal} newClient={newClient} />
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
        )}

        {tab === "entries" && (
          <div className="py-4">
            <span className="font-semibold text-lg">Add a new Entry</span>
            {/**add entry form */}

            <form className="w-full mt-8">
              <div className="w-full flex">
                <div className="w-1/3 pr-4">
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
                <div className="w-1/3 pl-4 pr-4">
                  <input
                    type="number"
                    id="revenue"
                    placeholder="Revenue *"
                    required
                    autoComplete="off"
                    className={inputStyles}
                    value={entry.revenue}
                    onChange={e =>
                      setEntry({ ...entry, revenue: e.target.value })
                    }
                  />
                </div>
                <div className="w-1/3 pl-4">
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
                      {timestampToDate(el?.created_at)}
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
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
