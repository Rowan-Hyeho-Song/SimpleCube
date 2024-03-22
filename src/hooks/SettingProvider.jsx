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
    // {
    //     key: "customColor",
    //     type: "button",
    //     icon: <Icon icon="PaletteDuotone" asset="pi" />,
    // },
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
                        key: "timeLimit-180000",
                        type: "icon",
                        value: "timeLimit-180000", 
                        icon: <div className="timeLimit limit-3m"><Icon icon="ClockCountdownDuotone" asset="pi" /></div>,
                    },
                    { 
                        key: "timeLimit-60000",
                        type: "icon",
                        value: "timeLimit-60000", 
                        icon: <div className="timeLimit limit-1m"><Icon className="timeLimit-1m" icon="ClockCountdownDuotone" asset="pi" /></div>,
                    },
                    { 
                        key: "timeLimit-30000",
                        type: "icon",
                        value: "timeLimit-30000", 
                        icon: <div className="timeLimit limit-30s"><Icon className="timeLimit-30s" icon="ClockCountdownDuotone" asset="pi" /></div>,
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

const getLocalStorage = (key, defaultValue = null) => {
    let val = window.localStorage.getItem(key);
    try {
        val = JSON.parse(val);
    } catch (err) {}
    return val || defaultValue;
};

export const SettingContext = createContext({});
export function SettingProvider({children}) {
    const [mode, setMode] = useState(getLocalStorage("mode", "play"));
    const [cubeType, setCubeType] = useState(getLocalStorage("cubeType", "cube3"));
    const [customColor, setCustomColor] = useState(getLocalStorage("customColor", {
        white: null, yellow: null,
        green: null, blue: null,
        orange: null, red: null
    }));
    const [penalty, setPenalty] = useState(getLocalStorage("penalty", []));
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
    const setModeLocalStorage = (value) => {
        setMode(value);
        window.localStorage.setItem("mode", value);
    };
    return [mode, setModeLocalStorage];
}
export const useCubeType = () => {
    const {cubeType, setCubeType } = useContext(SettingContext);
    const setCubeTypeLocalStorage = (value) => {
        setCubeType(value);
        window.localStorage.setItem("cubeType", value);
    };
    return [cubeType, setCubeTypeLocalStorage];
}
export const useCustomColor = () => {
    const {customColor, setCustomColor } = useContext(SettingContext);
    const setCustomColorLocalStorage = (value) => {
        setCustomColor(value);
        window.localStorage.setItem("customColor", JSON.stringify(value));
    };
    return [customColor, setCustomColorLocalStorage];
}
export const usePenalty = () => {
    const {penalty, setPenalty } = useContext(SettingContext);
    const setPenaltyLocalStorage = (value) => {
        setPenalty((prev) => {
            // 시간 제한 값의 경우 하나만 존재해야함
            const filtered = value.filter((v) => `${v}`.indexOf("timeLimit") > -1);
            if (filtered.length > 1) {
                const beforeTimeLimit = prev.find((v) => `${v}`.indexOf("timeLimit") > -1);
                const idx = value.findIndex((v) => v === beforeTimeLimit);
                value.splice(idx, 1);
            }
            return value;
        });
        window.localStorage.setItem("penalty", JSON.stringify(value));
    };
    return [penalty, setPenaltyLocalStorage];
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

