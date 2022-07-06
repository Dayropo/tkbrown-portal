import { useContext } from "react"
import { SidebarContext } from "../../context/SidebarContext"
import { FaHome, FaUserCircle } from "react-icons/fa"
import Logo from "../../public/white_logo_transparent_background.png"
import Image from "next/image"

const ClientSidebar = ({ tab, setTab }) => {
  const { showClientSidebar, setShowClientSidebar } = useContext(SidebarContext)
  const currentTab =
    "py-4 pl-8 rounded-l-full text-white bg-purple-400 cursor-pointer flex items-center w-full font-semibold"
  const regularTab =
    "py-4 pl-8 text-white cursor-pointer flex items-center w-full font-semibold hover:bg-purple-400 hover:rounded-l-full"

  return (
    <div
      className={`lg:w-1/5 lg:translate-x-0 w-64 fixed inset-y-0 left-0 transform transition duration-200 shadow-2xl ease-in-out flex flex-col bg-purple-700 bg-cover text-white text-sm font-light py-16 lg:pl-16 pl-6 z-50 ${
        showClientSidebar
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
        />
      </div>

      <div className="mt-6 space-y-4">
        <span
          className={tab === "dashboard" ? currentTab : regularTab}
          onClick={() => {
            setTab("dashboard")
            setShowClientSidebar(false)
          }}
        >
          <FaHome className="mr-4" /> Dashboard
        </span>
        <span
          className={tab === "account" ? currentTab : regularTab}
          onClick={() => {
            setTab("account")
            setShowClientSidebar(false)
          }}
        >
          <FaUserCircle className="mr-4" /> Account
        </span>
      </div>
    </div>
  )
}

export default ClientSidebar
