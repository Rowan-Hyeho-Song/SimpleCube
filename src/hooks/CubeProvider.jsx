import { useState, useContext, createContext } from "react";

export const CubeContext = createContext({});
export function CubeProvider({children}) {
    const [action, setAction] = useState("init");
    const [cubeRotate, setCubeRotate] = useState([-35, -45]);
    const [cubeCommand, setCubeCommand] = useState([]);
    const [commandMapping, setCommandMapping] = useState({
        U: "U",
        D: "D",
        F: "F",
        R: "R",
        B: "B",
        L: "L",
    });

    return (
        <CubeContext.Provider value={{
            action, setAction,
            cubeRotate, setCubeRotate,
            cubeCommand, setCubeCommand,
            commandMapping, setCommandMapping,
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
export const useCommandMapping = () => {
    const {commandMapping, setCommandMapping} = useContext(CubeContext);
    const xSide = ["U", "D"];
    const ySide = ["F", "R", "B", "L"];

    // 현재 큐브의 회전각을 참고하여 현 시점을 기준으로 명령어가 맵핑되도록 설정
    const changeCommandMapping = (cubeRotate) => {
        const [x, y] = cubeRotate;
        const xMove = (x + 35) / 180;
        const yMove = (y + 45) / 90;
        const fn = yMove < 0 ? ["shift", "push"] : ["pop", "unshift"];
        for(let i = 0; i < yMove; i++) {
            const temp = ySide[fn[0]];
            ySide[fn[1]](temp);
        }
        if (xMove % 2 === 1) {
            xSide.reverse();
            ySide.reverse();
        }
        setCommandMapping({
            U: xSide[0],
            D: xSide[1],
            F: ySide[0],
            R: ySide[1],
            B: ySide[2],
            L: ySide[3],
        });
    };
    return [commandMapping, changeCommandMapping];
}