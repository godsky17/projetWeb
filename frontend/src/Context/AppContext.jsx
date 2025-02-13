import { createContext, useState } from "react";

export const AppContext = createContext()

export default function AppProvider({children}){
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(localStorage.getItem('user'))
    
    return(
        <AppContext.Provider value={{token, setToken}}>
            {children}
        </AppContext.Provider>
    )
} 