import { useContext } from "react"
import { SidebarContext } from "../../context/SidebarContext"
import { FiUsers } from "react-icons/fi"
import { BsJournals } from "react-icons/bs"
import Image from "next/image"
import Logo from "../../public/white_logo_transparent_background.png"

const AdminSidebar = ({ tab, setTab }) => {
  const { showAdminSidebar, setShowAdminSidebar } = useContext(SidebarContext)
  const currentTab =
    "py-4 pl-8 rounded-l-full text-white bg-purple-400 cursor-pointer flex items-center w-full font-semibold"
  const regularTab =
    "py-4 pl-8 text-white cursor-pointer flex items-center w-full font-semibold hover:bg-purple-400 hover:rounded-l-full"

  return (
    <div
      className={`lg:w-1/5 lg:translate-x-0 w-64 fixed inset-y-0 left-0 transform transition duration-200 shadow-2xl ease-in-out flex flex-col bg-purple-700 bg-cover text-white text-sm font-light py-16 lg:pl-16 pl-6 z-50 ${
        showAdminSidebar
          ? "translate-x-0 shadow-lg"
          : "-translate-x-full shadow-none"
      }`}
    >
      <div className="relative flex lg:w-32 w-52 h-28 ">
        <Image
          src={Logo}
          layout="fill"
          objectFit="contain"
          alt="the tkbrown.co"
          priority
        />
      </div>

      <div className="mt-6 space-y-4">
        <span
          className={tab === "clients" ? currentTab : regularTab}
          onClick={() => {
            setTab("clients")
            setShowAdminSidebar(false)
          }}
        >
          <FiUsers className="mr-4" /> Clients
        </span>
        <span
          className={tab === "entries" ? currentTab : regularTab}
          onClick={() => {
            setTab("entries")
            setShowAdminSidebar(false)
          }}
        >
          <BsJournals className="mr-4" /> Entries
        </span>
      </div>
    </div>
  )
}

export default AdminSidebar
