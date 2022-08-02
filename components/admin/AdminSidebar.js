import { useContext } from "react"
import { SidebarContext } from "../../context/SidebarContext"
import { FiUsers, FiCreditCard } from "react-icons/fi"
import { BsJournals } from "react-icons/bs"
import Image from "next/image"
import Logo from "../../public/white_logo_transparent_background.png"

const AdminSidebar = ({ tab, setTab }) => {
  const { showAdminSidebar, setShowAdminSidebar } = useContext(SidebarContext)
  const currentTab =
    "py-4 px-8 before:absolute before:h-[54px] before:w-1.5 before:left-0 before:bg-purple-400 cursor-pointer flex relative items-center w-full font-semibold"
  const regularTab =
    "py-4 px-8 text-white cursor-pointer flex relative items-center w-full hover:bg-purple-400"

  return (
    <div
      className={`lg:w-1/5 lg:translate-x-0 w-64 fixed inset-y-0 left-0 transform transition duration-200 shadow-2xl ease-in-out flex flex-col bg-purple-700 bg-cover text-white text-sm font-light py-8 z-50 ${
        showAdminSidebar
          ? "translate-x-0 shadow-lg"
          : "-translate-x-full shadow-none"
      }`}
    >
      <div className="relative mx-auto flex lg:w-32 w-52 h-28 ">
        <Image
          src={Logo}
          layout="fill"
          objectFit="contain"
          alt="the tkbrown.co"
          priority
        />
      </div>

      <div className="mt-6">
        <div className="border-y border-purple-600">
          <span
            className={tab === "clients" ? currentTab : regularTab}
            onClick={() => {
              setTab("clients")
              setShowAdminSidebar(false)
            }}
          >
            <FiUsers className="mr-4" size={20} /> Clients
          </span>
        </div>
        <div className="border-y border-purple-600">
          <span
            className={tab === "entries" ? currentTab : regularTab}
            onClick={() => {
              setTab("entries")
              setShowAdminSidebar(false)
            }}
          >
            <BsJournals className="mr-4" size={20} /> Entries
          </span>
        </div>
        <div className="border-y border-purple-600">
          <span
            className={tab === "billings" ? currentTab : regularTab}
            onClick={() => {
              setTab("billings")
              setShowAdminSidebar(false)
            }}
          >
            <FiCreditCard className="mr-4" size={20} /> Billings
          </span>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar
