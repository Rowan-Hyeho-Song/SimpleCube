import { createContext, useState, useContext } from "react";
import i18n from "@constants/lang/i18n";
import Icon from "@components/common/Icon";

export const settingMenu = [
    { 
        key: "theme",
        type: "dropdown",
        icon: <Icon icon="CircleHalfFill" asset="pi" />,
        menus: [
            {
                type: "radioGroup",
                items: [
                    { 
                        key: "light", 
                        type: "icon",
                        value: "light", 
                        icon: <Icon icon="SunDuotone" asset="pi" />,
                    },
                    { 
                        key: "dark", 
                        type: "icon",
                        value: "dark", 
                        icon: <Icon icon="MoonDuotone" asset="pi" />,
                    },
                ]
            },
            
        ],
    },
    { 
        key: "mode", 
        type: "dropdown",
        icon: <Icon icon="CubeDuotone" asset="pi" />,
        menus: [
            {
                type: "radioGroup",
                items: [
                    { 
                        key: "play", 
                        type: "icon", 
                        value: "play", 
                        icon: <Icon icon="CubeDuotone" asset="pi" />,
                    },
                    { 
                        key: "solution", 
                        type: "icon", 
                        value: "solution", 
                        icon: <Icon icon="LightbulbDuotone" asset="pi" />,
                    },
                ]
            },
        ],
    },
    { 
        key: "cubeType", 
        type: "dropdown",
        icon: <Icon className="cubeType" icon="HelpHexagon" asset="tb" />,
        menus: [
            {
                type: "radioGroup",
                items: [
                    { 
                        key: "cube2", 
                        type: "icon",
                        value: "cube2", 
                        icon: <Icon icon="SquaresFourFill" asset="pi" />,
                    },
                    { 
                        key: "cube3", 
                        type: "icon",
                        value: "cube3", 
                        icon: <Icon icon="Grid3X3GapFill" asset="bs" />,
                    }
                ]
            },
            
        ],
    },
    {
        key: "customColor",
        type: "button",
        icon: <Icon icon="PaletteDuotone" asset="pi" />,
    },
    {
        key: "penalty",
        type: "dropdown",
        icon: <Icon icon="TwotoneExclamationCircle" asset="ai" />,
        menus: [
            {
                type: "checkboxGroup",
                items: [
                    { 
                        key: "blind",
                        type: "icon",
                        value: "blind", 
                        icon: <Icon icon="EyeSlashDuotone" asset="pi" />,
                    },
                    { 
                        key: "countLimit",
                        type: "icon",
                        value: "countLimit", 
                        icon: <Icon className="countLimit" icon="HexagonNumber0" asset="tb" />, 
                    },
                    { 
                        key: "timeLimit",
                        type: "icon",
                        value: "timeLimit", 
                        icon: <Icon className="timeLimit" icon="ClockCountdownDuotone" asset="pi" />,
                    },
                ]
            },
            
        ]
    },
    {
        key: "language",
        type: "dropdown",
        icon: <Icon icon="GlobeDuotone" asset="pi" />,
        menus: [
            {
                type: "radioGroup",
                items: [
                    {
                        key: "ko-KR",
                        type: "icon",
                        value: "ko-KR",
                        icon: <div className="lang-icon">KR</div>
                    },
                    {
                        key: "en-US",
                        type: "icon",
                        value: "en-US",
                        icon: <div className="lang-icon">US</div>
                    }
                ],
            },
        ]
    }
];

export const SettingContext = createContext({});
export function SettingProvider({children}) {
    const [mode, setMode] = useState("play");
    const [cubeType, setCubeType] = useState("cube3");
    const [customColor, setCustomColor] = useState({
        top: null, bottom: null,
        left: null, right: null,
        front: null, back: null
    });
    const [penalty, setPenalty] = useState([]);
    const [language, setLanguage] = useState(i18n.language);

    return (
        <SettingContext.Provider value={{
            mode, setMode,
            cubeType, setCubeType,
            customColor, setCustomColor,
            penalty, setPenalty,
            language, setLanguage,
        }}>
            {children}
        </SettingContext.Provider>
    );
}

export const useMode = () => {
    const {mode, setMode } = useContext(SettingContext);
    return [mode, setMode];
}
export const useCubeType = () => {
    const {cubeType, setCubeType } = useContext(SettingContext);
    return [cubeType, setCubeType];
}
export const useCustomColor = () => {
    const {customColor, setCustomColor } = useContext(SettingContext);
    return [customColor, setCustomColor];
}
export const usePenalty = () => {
    const {penalty, setPenalty } = useContext(SettingContext);
    return [penalty, setPenalty];
}
export const useLanguage = () => {
    const {language, setLanguage } = useContext(SettingContext);
    const changeLanguage = (key) => {
        if (key !== i18n.language) {
            setLanguage(key);
            i18n.changeLanguage(key);
        }
    };
    return [language, changeLanguage];
}

