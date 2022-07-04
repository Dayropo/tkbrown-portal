import ClientSidebar from "../sidebar/ClientSidebar"
import { FaUserCircle, FaUser } from "react-icons/fa"
import { FiLogOut, FiEdit, FiX, FiMenu } from "react-icons/fi"
import { useContext, useEffect, useState } from "react"
import Image from "next/image"
import payPal from "../../public/paypal.png"
import { SidebarContext } from "../../context/SidebarContext"
import { useRouter } from "next/router"
import { AuthContext } from "../../context/AuthContext"
import useSWR from "swr"
import axios from "axios"
import { timestampToDate } from "../../utils/helpers"

const Menu = ({ setTab, setIsOpen }) => {
  const router = useRouter()

  return (
    <div className="origin-top-right absolute top-0 right-0 mt-14 mr-6 sm:w-48 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
      <div className="flex flex-col py-4">
        <span
          className="flex items-center justify-between py-3 px-6 cursor-pointer hover:bg-purple-100"
          onClick={() => {
            setTab("account")
            setIsOpen(false)
          }}
        >
          <FiEdit />
          <p className="sm:text-base text-sm">Edit Profile</p>
        </span>
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

const ClientDashboard = ({ client }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState("dashboard")

  const { showClientSidebar, setShowClientSidebar } = useContext(SidebarContext)
  const { auth } = useContext(AuthContext)

  //form styles
  const inputStyles =
    "text-black font-normal bg-purple-50 px-4 pt-2 pb-1.5 border-b-2 border-gray-400 w-full placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-none focus:border-purple-600"

  // dashboard states
  const [totalRevenue, setTotalRevenue] = useState("")
  const [totalImpressions, setTotalImpressions] = useState("")
  const eCPM = (totalRevenue / totalImpressions) * 1000

  // billings state
  const [paypal, setPaypal] = useState(false)

  const toggleOptions = () => {
    setPaypal(prev => !prev)
  }

  //get entries
  const router = useRouter()
  const { clientId } = router.query

  const { data: entries } = useSWR("entries", async () => {
    const res = await axios.get(`/api/entries/${clientId}`).catch(error => {
      console.error(error?.response)
    })
    if (res?.data) {
      console.log(res?.data[0])
      setTotalRevenue(res?.data[0]?.revenue)
      setTotalImpressions(res?.data[0]?.impressions)
    }

    return res?.data
  })
  console.log(entries)

  return (
    <div className="relative min-h-screen lg:w-4/5 ml-auto">
      <ClientSidebar tab={tab} setTab={setTab} />

      <nav className="flex justify-end items-center h-12 px-8">
        <span
          className="flex items-center cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen)
          }}
        >
          <FaUserCircle size={16} className="sm:mr-2 mr-0" />
          <p className="sm:block hidden">{client?.email}</p>
        </span>
        <div className="lg:hidden flex ml-2.5">
          {showClientSidebar ? (
            <FiX size={16} onClick={() => setShowClientSidebar(false)} />
          ) : (
            <FiMenu size={16} onClick={() => setShowClientSidebar(true)} />
          )}
        </div>
        {isOpen && <Menu setTab={setTab} setIsOpen={setIsOpen} />}
      </nav>

      <main className="sm:px-16 sm:py-10 px-4 py-2.5">
        {tab === "dashboard" && (
          <div className="py-4">
            <span className="font-semibold text-lg">{`Welcome, ${client?.email}`}</span>
            {/**summary */}
            <div className="w-full mt-5 py-6 px-8 bg-purple-500 rounded-xl flex flex-wrap item-center justify-between text-white">
              <div>
                <p className="text-xs">Total Revenue</p>
                <p className="sm:text-2xl text-xl">{`${totalRevenue} €`}</p>
              </div>
              <div>
                <p className="text-xs">Total Impressions</p>
                <p className="sm:text-2xl text-xl">{`${totalImpressions}`}</p>
              </div>
              <div>
                <p className="text-xs">eCPM</p>
                <p className="sm:text-2xl text-xl">{eCPM.toFixed(2)}</p>
              </div>
            </div>

            {/**chart */}
            <div></div>

            {/**daily input */}
            <div className="mt-8 flex flex-col">
              <div className="flex w-full py-3 bg-purple-300 rounded-t-md text-white items-end">
                <span className="w-1/4 text-center sm:text-base text-sm">
                  Date
                </span>
                <span className="w-1/4 text-center sm:text-base text-sm">
                  Revenue
                </span>
                <span className="w-1/4 text-center sm:text-base text-sm">
                  Impressions
                </span>
                <span className="w-1/4 text-center sm:text-base text-sm">
                  eCPM
                </span>
              </div>
              {/**records mapping */}
              {entries?.map((entry, index) => (
                <div
                  key={index}
                  className={`${
                    index === entries.length - 1 ? "rounded-b-md" : null
                  } flex w-full py-3 bg-white text-black items-center`}
                >
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    {timestampToDate(entry?.created_at)}
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    {entry?.revenue}
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    {entry?.impressions}
                  </span>
                  <span className="w-1/4 text-center sm:text-base text-sm">
                    {entry?.eCPM}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "account" && (
          <div className="py-4">
            <span className="font-semibold text-lg">My Account</span>
            {/**personal details */}
            <div className="xl:w-2/5 md:w-1/2 mt-5 bg-purple-500 py-6 px-8 rounded-xl text-white flex">
              <div className="rounded-full bg-gray-200 w-16 h-16 flex items-center justify-center mr-2.5">
                <FaUser size={24} />
              </div>
              <div className="mt-2.5">
                <p>{}</p>
                <p>Company Name</p>
              </div>
            </div>

            {/** billing details */}
            <div className="py-4">
              <span className="font-semibold text-lg">Payment Details</span>
              {/**options */}
              <div className="flex w-full mt-6">
                <div className="w-1/2 pr-4 flex items-center">
                  <input
                    type="checkbox"
                    id="transfer"
                    className="h-4 w-4 mr-2.5 accent-purple-500"
                    checked={!paypal}
                    onChange={() => toggleOptions()}
                  />
                  <label htmlFor="transfer">Bank Transfer</label>
                </div>
                <div className="w-1/2 pl-4 flex items-center">
                  <input
                    type="checkbox"
                    id="paypal"
                    className="h-4 w-4 mr-2.5 accent-purple-500 bg-none"
                    checked={paypal}
                    onChange={() => toggleOptions()}
                  />
                  <label htmlFor="paypal" className="relative flex h-6 w-20">
                    <Image src={payPal} objectFit="contain" layout="fill" />
                  </label>
                </div>
              </div>

              {paypal ? (
                <form className="w-full mt-8">
                  <div className="w-full">
                    <input
                      type="text"
                      id="paypalEmail"
                      placeholder="PayPal Email Address *"
                      required
                      autoComplete="off"
                      className={inputStyles}
                    />
                  </div>
                  <button className="mt-8 bg-purple-500 text-white py-2 px-6 rounded text-sm">
                    UPDATE BILLING DETAILS
                  </button>
                </form>
              ) : (
                <form className="w-full mt-8">
                  <div className="flex w-full">
                    <div className="w-1/2 pr-4">
                      <input
                        type="text"
                        id="bank"
                        placeholder="Bank Name *"
                        required
                        autoComplete="off"
                        className={inputStyles}
                      />
                    </div>
                    <div className="w-1/2 pl-4">
                      <input
                        type="text"
                        id="account"
                        placeholder="Bank Account Number *"
                        required
                        autoComplete="off"
                        className={inputStyles}
                      />
                    </div>
                  </div>
                  <div className="flex w-full mt-8">
                    <div className="w-1/2 pr-4">
                      <input
                        type="text"
                        id="bank"
                        placeholder="Bank Swift/Bic *"
                        required
                        autoComplete="off"
                        className={inputStyles}
                      />
                    </div>
                    <div className="w-1/2 pl-4">
                      <input
                        type="text"
                        id="account"
                        placeholder="Bank Address *"
                        required
                        autoComplete="off"
                        className={inputStyles}
                      />
                    </div>
                  </div>
                  <button className="mt-8 bg-purple-500 text-white py-2 px-6 rounded text-sm">
                    UPDATE BILLING DETAILS
                  </button>
                </form>
              )}
            </div>

            {/**change password */}
            <div className="py-4">
              <span className="text-lg font-semibold">Change Password</span>
              <form className="w-full mt-8">
                <div className="flex w-full">
                  <div className="w-1/2 pr-4">
                    <input
                      type="text"
                      id="password"
                      placeholder="Password *"
                      required
                      autoComplete="off"
                      className={inputStyles}
                    />
                  </div>
                  <div className="w-1/2 pl-4">
                    <input
                      type="text"
                      id="confirm"
                      placeholder="Confirm Password *"
                      required
                      autoComplete="off"
                      className={inputStyles}
                    />
                  </div>
                </div>
                <button className="mt-8 bg-purple-500 text-white py-2 px-6 rounded text-sm">
                  UPDATE PASSWORD
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ClientDashboard
