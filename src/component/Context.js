import React,{createContext, useState} from 'react'
let context = createContext();
export default function Provider({ children }) {
    const [onlineuser, Setonlineuser] = useState([])

    return (
        <context.Provider value={{ 
            onlineuser: onlineuser,
            Setonlineuser: Setonlineuser
         }}>
             { children }
        </context.Provider>
    )
}

export {Provider, context}
