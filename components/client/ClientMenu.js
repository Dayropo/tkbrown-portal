import { useRouter } from "next/router"
import { FiLogOut, FiEdit } from "react-icons/fi"
import axios from "axios"

const ClientMenu = ({ setTab, setIsOpen }) => {
  const router = useRouter()

  const handleLogout = async () => {
    const res = await axios.post("/api/v2/signout/").catch(error => {
      console.error(error?.response)
    })
    if (res?.data) {
      router.push("/")
    }
  }

  return (
    <div className="origin-top-right absolute top-0 right-0 mt-14 mr-6 sm:w-48 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
      <div className="flex flex-col py-4">
        <span
          className="flex items-center justify-between py-3 px-6 cursor-pointer hover:bg-purple-100"
          onClick={() => {
            setTab("settings")
            setIsOpen(false)
          }}
        >
          <FiEdit />
          <p className="sm:text-base text-sm">Edit Profile</p>
        </span>
        <span
          className="flex items-center justify-between py-3 px-6 cursor-pointer hover:bg-purple-100"
          onClick={() => handleLogout()}
        >
          <FiLogOut />
          <p className="sm:text-base text-sm">Sign Out</p>
        </span>
      </div>
    </div>
  )
}

export default ClientMenu
