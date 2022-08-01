import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import useSWR from "swr"
import { FaUserCircle, FaUser } from "react-icons/fa"
import { withIronSessionSsr } from "iron-session/next"
import { sessionOptions } from "../lib/session"
import ClientMenu from "../components/client/ClientMenu"
import { FiX, FiMenu } from "react-icons/fi"
import Dashboard from "../components/client/Dashboard"
import ClientSidebar from "../components/client/ClientSidebar"
import { SidebarContext } from "../context/SidebarContext"
import Head from "next/head"
import { fetcher } from "../lib/fetcher"
import Logo from "../public/logo_transparent_background.png"
import Image from "next/image"
import Billing from "../components/client/Billing"
import Settings from "../components/client/Settings"
import Payments from "../components/client/Payments"

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
  const [domainIndex, setDomainIndex] = useState(0)

  const { showClientSidebar, setShowClientSidebar } = useContext(SidebarContext)

  const { data, error } = useSWR(`/api/clients?email=${user?.email}`, fetcher)

  if (data) {
    return (
      <div className="relative min-h-screen lg:w-4/5 ml-auto">
        <Head>
          <title>TKBrown | Dashboard</title>
          {/* <meta name="description" content="Generated by create next app" /> */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/logo_transparent_background_small.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/logo_transparent_background_small.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/logo_transparent_background_small.png"
          />
          <link rel="manifest" href="/site.webmanifest"></link>
        </Head>

        <ClientSidebar
          tab={tab}
          setTab={setTab}
          data={data}
          domainIndex={domainIndex}
          setDomainIndex={setDomainIndex}
        />

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

        <main
          className="sm:px-16 px-4 py-2.5"
          onClick={() => {
            setIsOpen(false)
            setShowClientSidebar(false)
          }}
        >
          {tab === "dashboard" && (
            <Dashboard user={user} company={data[domainIndex]?.company} />
          )}

          {tab === "billing" && (
            <Billing user={user} company={data[domainIndex]?.company} />
          )}

          {tab === "settings" && <Settings user={user} />}

          {tab === "payments" && (
            <Payments user={user} company={data[domainIndex]?.company} />
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-40 h-40 relative flex animate-pulse">
        <Image src={Logo} objectFit="contain" layout="fill" />
      </div>
    </div>
  )
}

export default ClientDetails
