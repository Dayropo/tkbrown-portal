import AdminSidebar from "../sidebar/AdminSidebar"
import { FaUserCircle, FaUser } from "react-icons/fa"
import { FiLogOut, FiX, FiMenu } from "react-icons/fi"
import { useContext, useEffect, useState } from "react"
import { SidebarContext } from "../../context/SidebarContext"
import { useRouter } from "next/router"

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

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState("clients")

  const { showAdminSidebar, setShowAdminSidebar } = useContext(SidebarContext)

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
          <p className="sm:block hidden">admin@email.com</p>
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
          <div className="py-4">
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
                  />
                </div>
              </div>
              <button className="mt-8 bg-purple-500 text-white py-2 px-6 rounded text-sm">
                ADD CLIENT
              </button>
            </form>

            {/**view clients */}
            <div className="py-4 mt-8">
              <span className="font-semibold text-lg">Clients</span>
              <div className="mt-8 flex flex-col">
                <div className="flex sm:w-2/3 w-full py-3 bg-purple-300 rounded-t-md text-white items-end">
                  <span className="w-1/2 text-center sm:text-base text-sm">
                    Email
                  </span>
                  <span className="w-1/2 text-center sm:text-base text-sm">
                    Company Name
                  </span>
                </div>
                {/**client mapping */}
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
                    autoComplete="off"
                    className={inputStyles}
                  />
                </div>
                <div className="w-1/3 pl-4 pr-4">
                  <input
                    type="text"
                    id="revenue"
                    placeholder="Revenue *"
                    required
                    autoComplete="off"
                    className={inputStyles}
                  />
                </div>
                <div className="w-1/3 pl-4">
                  <input
                    type="text"
                    id="impression"
                    placeholder="Impressions (K) *"
                    required
                    autoComplete="off"
                    className={inputStyles}
                  />
                </div>
              </div>
              <button className="mt-8 bg-purple-500 text-white py-2 px-6 rounded text-sm">
                ADD ENTRY
              </button>
            </form>

            {/**view clients */}
            <div className="py-4 mt-8">
              <span className="font-semibold text-lg">Entries</span>
              <div className="mt-8 flex flex-col">
                <div className="flex w-full py-3 bg-purple-300 rounded-t-md text-white items-end">
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    Date
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    Client
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    Revenue
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    Impressions (K)
                  </span>
                </div>
                {/**entry mapping */}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
