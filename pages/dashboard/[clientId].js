import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import useSWR from "swr"
import { FaUserCircle, FaUser } from "react-icons/fa"
import { withIronSessionSsr } from "iron-session/next"
import { sessionOptions } from "../../lib/session"
import ClientMenu from "../../components/client/ClientMenu"
import { FiX, FiMenu } from "react-icons/fi"
import Dashboard from "../../components/client/Dashboard"
import MyAccount from "../../components/client/MyAccount"
import ClientSidebar from "../../components/client/ClientSidebar"
import { SidebarContext } from "../../context/SidebarContext"

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session?.user

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    }
  }

  return {
    props: {
      user: req.session?.user,
    },
  }
},
sessionOptions)

const ClientDetails = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState("dashboard")

  const { showClientSidebar, setShowClientSidebar } = useContext(SidebarContext)

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
          <p className="sm:block hidden">{user?.email}</p>
        </span>
        <div className="lg:hidden flex ml-2.5">
          {showClientSidebar ? (
            <FiX size={16} onClick={() => setShowClientSidebar(false)} />
          ) : (
            <FiMenu size={16} onClick={() => setShowClientSidebar(true)} />
          )}
        </div>
        {isOpen && <ClientMenu setTab={setTab} setIsOpen={setIsOpen} />}
      </nav>

      <main className="sm:px-16 sm:py-10 px-4 py-2.5">
        {tab === "dashboard" && <Dashboard user={user} />}

        {tab === "account" && <MyAccount />}
      </main>
    </div>
  )
}

export default ClientDetails
