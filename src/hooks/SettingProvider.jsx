import { createContext, useState } from "react";
import Icon from "@components/common/Icon";

export const settingMenu = [
    { 
        key: "mode", 
        type: "dropdown",
        icon: <Icon icon="CubeDuotone" asset="pi" />,
        menus: [
            { 
                key: "play", 
                type: "switch", 
                value: "play", 
                icon: <Icon icon="CubeDuotone" asset="pi" />,
            },
            { 
                key: "solution", 
                type: "switch", 
                value: "solution", 
                icon: <Icon icon="LightbulbDuotone" asset="pi" />,
            },
        ],
    },
    { 
        key: "theme",
        type: "dropdown",
        icon: <Icon icon="CircleHalfFill" asset="pi" />,
        menus: [
            { 
                key: "light", 
                type: "switch",
                value: "light", 
                icon: <Icon icon="SunDuotone" asset="pi" />,
            },
            { 
                key: "dark", 
                type: "switch",
                value: "dark", 
                icon: <Icon icon="MoonDuotone " asset="pi" />,
            },
        ],
    },
    { 
        key: "cubeType", 
        type: "dropdown",
        icon: <Icon className="cubeType" icon="HelpHexagon" asset="tb" />,
        menus: [
            { 
                key: "cube2", 
                type: "switch",
                value: "cube2", 
                icon: <Icon icon="SquaresFourFill" asset="pi" />,
            },
            { 
                key: "cube3", 
                type: "switch",
                value: "cube3", 
                icon: <Icon icon="Grid3X3GapFill" asset="bs" />,
            },
        ],
    },
    {
        key: "customColor",
        type: "button",
        icon: <Icon icon="PaletteDuotone" asset="pi" />,
        menus: []
    },
    {
        key: "penalty",
        type: "dropdown",
        icon: <Icon icon="TwotoneExclamationCircle" asset="ai" />,
        menus: [
            { 
                key: "blind",
                type: "checkbox",
                value: "blind", 
                icon: <Icon icon="SlashDuotone" asset="pi" />,
            },
            { 
                key: "countLimit",
                type: "checkbox",
                value: "countLimit", 
                icon: <Icon className="countLimit" icon="HexagonNumber0" asset="tb" />, 
            },
            { 
                key: "timeLimit",
                type: "checkbox",
                value: "timeLimit", 
                icon: <Icon className="timeLimit" icon="ClockCountdownDuotone" asset="pi" />,
            },
        ]
    }
];

const SettingContext = createContext({});
export function SettingProvider({children}) {
    const [mode, setMode] = useState("play");
    const [cubeType, setCubeType] = useState("cube3");
    const [customColor, setCustomColor] = useState([]);
    const [penalty, setPenalty] = useState([]);

    return (
        <SettingContext.Provider value={{
            mode, setMode,
            cubeType, setCubeType,
            customColor, setCustomColor,
            penalty, setPenalty
        }}>
            {children}
        </SettingContext.Provider>
    );
}

