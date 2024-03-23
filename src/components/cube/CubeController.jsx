import { useState, useEffect} from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";
import { useAction, useCubeRotate, useCubeCommand, useCommandMapping, useSelectedColor } from "@hooks/CubeProvider";
import { useMode, useCubeType } from "@hooks/SettingProvider";
import Icon from "@components/common/Icon";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    bottom: 30vh;
    left: calc(50% - 150px);
    font-weight: 600;
    color: ${({theme}) => theme.menu.font};

    & * {
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }

    .main-button {
        text-align: center;
        width: 100%;
        padding: 1em;
        border-radius: 5px;
        background-color: ${({theme}) => theme.menu.background};
        cursor: pointer;
        
        @media (hover: hover) and (pointer: fine) {
            &:hover {
                background-color: ${({theme}) => theme.menu.subHoverBackground};
            }
        }
        &.shuffle {
            background-color: ${({theme}) => theme.menu.selectBackground};
        }

        &.failed {
            background-color: ${({theme}) => theme.failedColor};
        }
    }
`;
const ControlBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;

    .reset-button {
        position: relative !important;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 100%;
        padding: 0.5em;
        border-radius: 5px;
        cursor: pointer;
        background-color: ${({theme}) => theme.failedColor};

        > svg {
            font-size: 1.2rem;
            margin-right: 0.5rem;
        }
    }
`;

function CubeController() {
    const [cubeType] = useCubeType();
    const [mode] = useMode();
    const [action, setAction] = useAction();
    const [selectedColor, updateSelectedColor] = useSelectedColor();
    const { t } = useTranslation();

    useEffect(() => {
        setAction("init");
    }, []);
    useEffect(() => {
        setAction("init");
    }, [cubeType]);

    const updateCubeAction = (act = null) => {
        const actions = ["init", "shuffle", "play", "solved"];
        const now = actions.findIndex((act) => act === action);
        const nowAct = act || actions[now + 1 == actions.length ? 0 : now + 1];
        setAction(nowAct);
    };
    const resetCubeState = () => {
        updateSelectedColor("red");
        updateCubeAction("init");
    }
    const getMainButtonText = (act) => {
        const text = {
            init: "shuffle",
            shuffle: "play",
            play: "playing",
            solved: "solved",
            failed: "retry"
        };
        return text[act];
    };
    
    return (
        <Container>
            {
                mode === "play" ? (
                    <>
                        { action !== "play" ? (
                            <div 
                                className={`main-button ${action}`}
                                onClick={() => updateCubeAction()}
                            >
                                {t(`control.button.${getMainButtonText(action)}`)}
                            </div>
                        ) : (
                            <ControlBox>
                                <CubeViewControl />
                                <CubeSwapControl />
                            </ControlBox>
                        )}
                    </>
                ) : (
                    <>
                        <ControlBox>
                            <CubeViewControl />
                            <div 
                                className={`reset-button`}
                                onClick={() => resetCubeState()}
                            >
                                <Icon icon="ArrowClockwiseBold" asset="pi" />
                                {t(`control.button.reset`)}
                            </div>
                            <ColorGuide />
                        </ControlBox>
                    </>
                )
            }
        </Container>
    );
}

const ViewControl = styled.div`
    position: relative !important;
    display: flex;
    width: 100%;
    margin-bottom: 10px;

    .view-button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 5vh;
        flex: 1;
        font-size: 1.3rem;
        color: ${({theme}) => theme.menu.font};
        background-color: ${({theme}) => theme.menu.background};
        cursor: pointer;
        transition: all 0.3s;

        @media (hover: hover) and (pointer: fine) {
            &:hover {
                background-color: ${({theme}) => theme.menu.subHoverBackground};
            }
        }
        &:first-child {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
        }
        &:last-child {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
        }
    }

    .flex-row {
        position: relative;
        display: flex;
        width: 100%;
        margin-bottom: 10px;
    }
`;

function CubeViewControl() {
    const [cubeRotate, setCubeRotate] = useCubeRotate();
    const [commandMapping, setCommandMapping] = useCommandMapping();
    const rotateCube = (direction) => {
        let [x, y] = cubeRotate;
        if (direction == "up") {
            x += 180;
        } else {
            const sign = Math.floor((cubeRotate[0] + 45) / 180) % 2 == 0 ? 1 : -1;
            const direct = direction == "left" ? -1 : 1;
            y += 90 * sign * direct;
        }
        setCubeRotate([x, y]);
        setCommandMapping([x, y]);
    }
    return (
        <ViewControl>
            <div className={`view-button turn-left`} onClick={() => rotateCube("left")}>
                <Icon asset="tb" icon="ArrowBigLeftFilled" />
            </div>
            <div className={`view-button turn-up`} onClick={() => rotateCube("up")}>
                <Icon asset="tb" icon="ArrowBigUpLineFilled" />
            </div>
            <div className={`view-button turn-right`} onClick={() => rotateCube("right")}>
                <Icon asset="tb" icon="ArrowBigRightFilled" />
            </div>
        </ViewControl>
    );
}

function CubeSwapControl() {
    const [cubeCommand, setCubeCommand] = useCubeCommand();
    const [commandMapping] = useCommandMapping();
    const cmds = ["U", "D", "L", "R", "F", "B"];
    const appendCommand = (value) => {
        setCubeCommand([...cubeCommand, value]);
    };
    return (
        <ViewControl style={{flexDirection: "column"}}>
            {["", "'"].map((clockwise, i) =>{
                return (
                    <div key={`swap-control-${i}`} className="flex-row">
                        {cmds.map((cmd) => {
                            const word = `${cmd}${clockwise}`;
                            return (
                                <div 
                                    key={`cmd-btn-${cmd}${clockwise == "" ? "" : "-reverse"}`} 
                                    className={`view-button`}
                                    onClick={() => appendCommand(`${commandMapping[cmd]}${clockwise}`)}
                                >
                                    {word}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </ViewControl>
    );
}

const SCColorGuide = styled.div`
    top: -60vh;
    width: 100%;
    text-align: center;
    color: ${({theme}) => theme.font};
    
    font-size: 1.3rem;

    span {
        padding: 0.2rem;
        border-radius: 5px;
        &.red {
            color: ${({theme}) => theme.menu.font};
            background-color: ${({theme}) => theme.faceColor.red};
        }
        &.green {
            color: #2a2a2a;
            background-color: ${({theme}) => theme.faceColor.green};
        }
        &.white {
            color: #2a2a2a;
            background-color: ${({theme}) => theme.faceColor.white};
        }
        &.yellow {
            color: #2a2a2a;
            background-color: ${({theme}) => theme.faceColor.yellow};
        }
        &.blue {
            color: ${({theme}) => theme.menu.font};
            background-color: ${({theme}) => theme.faceColor.blue};
        }
        &.orange {
            color: ${({theme}) => theme.menu.font};
            background-color: ${({theme}) => theme.faceColor.orange};
        }
    }
`;

function ColorGuide() {
    const [selectedColor, updateSelectedColor] = useSelectedColor();
    const { t } = useTranslation();
    return (
        <SCColorGuide>
            {selectedColor !== "finish" && (
                <Trans 
                    i18nKey="control.colorGuide" 
                    values={{ color: t(`control.colors.${selectedColor}`)}}
                    components={{ span: <span className={selectedColor}></span>}}
                >
                    Add <span>{{selectedColor}}</span> fields
                </Trans>
            )}
        </SCColorGuide>
    )
}

export default CubeController;