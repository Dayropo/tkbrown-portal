import { useContext, useState } from "react"
import { SidebarContext } from "../../context/SidebarContext"
import { FaHome, FaUserCircle, FaLaptop } from "react-icons/fa"
import { BiBarChartSquare } from "react-icons/bi"
import { FiChevronDown, FiChevronUp, FiCreditCard } from "react-icons/fi"
import Image from "next/image"
import Logo from "../../public/white_logo_transparent_background.png"

const ClientSidebar = ({ tab, setTab, data, domainIndex, setDomainIndex }) => {
  console.log({ data })
  const { showClientSidebar, setShowClientSidebar } = useContext(SidebarContext)
  const [showSubMenu, setShowSubMenu] = useState(false)
  const currentTab =
    "py-4 px-8 before:absolute before:h-[54px] before:w-1.5 before:left-0 before:bg-purple-400 cursor-pointer flex relative items-center w-full font-semibold"
  // const currentTab =
  //   "py-4 px-8 rounded-l-full text-white bg-purple-400 cursor-pointer flex relative items-center w-full font-semibold"
  const regularTab =
    "py-4 px-8 text-white cursor-pointer flex relative items-center w-full hover:bg-purple-400"
  const currentSubMenu =
    "py-4 px-8 text-white cursor-pointer flex relative items-center w-full bg-purple-400"

  return (
    <div
      className={`lg:w-1/5 lg:translate-x-0 w-64 fixed inset-y-0 left-0 transform transition duration-200 shadow-2xl ease-in-out flex flex-col bg-purple-700 bg-cover text-white text-sm font-light py-8 z-50 ${
        showClientSidebar
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
            className={tab === "dashboard" ? currentTab : regularTab}
            onClick={() => {
              // setShowClientSidebar(false)
              setShowSubMenu(!showSubMenu)
            }}
          >
            <BiBarChartSquare className="mr-4" size={20} /> Reporting
            {showSubMenu ? (
              <FiChevronUp size={20} className="absolute right-8" />
            ) : (
              <FiChevronDown size={20} className="absolute right-8" />
            )}
          </span>
          <div className="flex flex-col">
            {showSubMenu &&
              data?.map((item, index) => (
                <span
                  key={index}
                  className={
                    domainIndex === index ? currentSubMenu : regularTab
                  }
                  onClick={() => {
                    setTab("dashboard")
                    setDomainIndex(index)
                    setShowSubMenu(false)
                    setShowClientSidebar(false)
                  }}
                >
                  <FaLaptop className="mx-4" size={20} /> {item.company}
                </span>
              ))}
          </div>
        </div>
        <div className="border-y border-purple-600">
          <span
            className={tab === "account" ? currentTab : regularTab}
            onClick={() => {
              setTab("account")
              setShowClientSidebar(false)
            }}
          >
            <FaUserCircle className="mr-4" size={20} /> Account
          </span>
        </div>
        <div className="border-y border-purple-600">
          <span
            className={tab === "billing" ? currentTab : regularTab}
            onClick={() => {
              setTab("billing")
              setShowClientSidebar(false)
            }}
          >
            <FiCreditCard className="mr-4" size={20} /> Billing
          </span>
        </div>
      </div>
    </div>
  )
}

export default ClientSidebar
