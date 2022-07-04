import Layout from "../components/Layout"
import AuthContextProvider from "../context/AuthContext"
import SidebarContextProvider from "../context/SidebarContext"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <AuthContextProvider>
        <SidebarContextProvider>
          <Component {...pageProps} />
        </SidebarContextProvider>
      </AuthContextProvider>
    </Layout>
  )
}

export default MyApp
