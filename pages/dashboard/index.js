import { useContext, useState } from "react"
import { withIronSessionSsr } from "iron-session/next"
import { sessionOptions } from "../../lib/session"
import AdminMenu from "../../components/admin/AdminMenu"
import Clients from "../../components/admin/Clients"
import Entries from "../../components/admin/Entries"
import { FaUserCircle } from "react-icons/fa"
import { FiX, FiMenu } from "react-icons/fi"
import { SidebarContext } from "../../context/SidebarContext"
import AdminSidebar from "../../components/admin/AdminSidebar"

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

const Dashboard = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState("clients")

  const { showAdminSidebar, setShowAdminSidebar } = useContext(SidebarContext)

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
          <p className="sm:block hidden">{user?.email}</p>
        </span>
        <div className="lg:hidden flex ml-2.5">
          {showAdminSidebar ? (
            <FiX size={16} onClick={() => setShowAdminSidebar(false)} />
          ) : (
            <FiMenu size={16} onClick={() => setShowAdminSidebar(true)} />
          )}
        </div>
        {isOpen && <AdminMenu setTab={setTab} setIsOpen={setIsOpen} />}
      </nav>

      <main className="sm:px-16 sm:py-10 px-4 py-2.5">
        {tab === "clients" && <Clients />}

        {tab === "entries" && <Entries />}
      </main>
    </div>
  )
}

export default Dashboard
