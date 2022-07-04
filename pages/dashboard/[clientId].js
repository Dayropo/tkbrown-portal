import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import ClientDashboard from "../../components/dashboard/ClientDashboard"
import { AuthContext } from "../../context/AuthContext"
import useSWR from "swr"
import axios from "axios"

const ClientDetails = () => {
  const { auth } = useContext(AuthContext)
  const router = useRouter()

  const { clientId } = router.query

  useEffect(() => {
    if (!auth?.role) {
      router.push("/")
    }
  })

  const { data: client } = useSWR("client", async () => {
    const res = await axios.get(`/api/clients/${clientId}`).catch(error => {
      console.error(error?.response)
    })
    return res?.data
  })

  return <ClientDashboard client={client} />
}

export default ClientDetails
