import { useContext, useEffect } from "react"
import AdminDashboard from "../../components/dashboard/AdminDashboard"
import { AuthContext } from "../../context/AuthContext"
import { useRouter } from "next/router"

const Dashboard = () => {
  const { auth } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!auth?.role) {
      router.push("/")
    }
  })

  return <AdminDashboard />
}

export default Dashboard
