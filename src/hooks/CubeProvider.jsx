import { useState, useContext, createContext } from "react";

export const CubeContext = createContext({});
export function CubeProvider({children}) {
    const [action, setAction] = useState("init");

    return (
        <CubeContext.Provider value={{
            action, setAction,
        }}>
            {children}
        </CubeContext.Provider>
    )
}
export const useAction = () => {
    const {action, setAction } = useContext(CubeContext);
    return [action, setAction];
}