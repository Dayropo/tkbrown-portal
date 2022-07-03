import { useState } from "react"
import AdminDashboard from "../components/dashboard/AdminDashboard"
import ClientDashboard from "../components/dashboard/ClientDashboard"
import SidebarContextProvider from "../context/SidebarContext"

const Dashboard = () => {
  const [userType, setUserType] = useState("client")

  return (
    <SidebarContextProvider>
      {userType === "admin" ? (
        <AdminDashboard />
      ) : userType === "client" ? (
        <ClientDashboard />
      ) : null}
    </SidebarContextProvider>
  )
}

export default Dashboard
