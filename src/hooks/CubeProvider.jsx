import { useState, useContext, createContext } from "react";

export const CubeContext = createContext({});
export function CubeProvider({children}) {
    const [action, setAction] = useState("init");
    const [cubeRotate, setCubeRotate] = useState([-45, -45]);
    const [cubeCommand, setCubeCommand] = useState([]);

    return (
        <CubeContext.Provider value={{
            action, setAction,
            cubeRotate, setCubeRotate,
            cubeCommand, setCubeCommand,
        }}>
            {children}
        </CubeContext.Provider>
    )
}
export const useAction = () => {
    const {action, setAction} = useContext(CubeContext);
    return [action, setAction];
}
export const useCubeRotate = () => {
    const {cubeRotate, setCubeRotate} = useContext(CubeContext);
    return [cubeRotate, setCubeRotate];
}
export const useCubeCommand = () => {
    const {cubeCommand, setCubeCommand} = useContext(CubeContext);
    return [cubeCommand, setCubeCommand];
}