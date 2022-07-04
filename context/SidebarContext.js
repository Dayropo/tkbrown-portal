import { createContext, useState } from "react"

export const SidebarContext = createContext()

const SidebarContextProvider = ({ children }) => {
  const [showAdminSidebar, setShowAdminSidebar] = useState(false)
  const [showClientSidebar, setShowClientSidebar] = useState(false)

  return (
    <SidebarContext.Provider
      value={{
        showAdminSidebar,
        setShowAdminSidebar,
        showClientSidebar,
        setShowClientSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarContextProvider
