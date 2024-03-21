import { useState, useEffect} from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useAction, useCubeRotate, useCubeCommand } from "@hooks/CubeProvider";
import { useMode, useCubeType } from "@hooks/SettingProvider";
import Icon from "@components/common/Icon";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    bottom: 23%;
    left: calc(50% - 150px);
    font-weight: 600;
    color: ${({theme}) => theme.menu.font};

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
    }
`;
const ControlBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
`;

function CubeController() {
    const [cubeType] = useCubeType();
    const [mode] = useMode();
    const [action, setAction] = useAction();
    const { t } = useTranslation();

    useEffect(() => {
        setAction("init");
    }, []);
    useEffect(() => {
        setAction("init");
    }, [cubeType]);

    const updateCubeAction = () => {
        const actions = ["init", "shuffle", "play", "solved"];
        const now = actions.findIndex((act) => act === action);
        setAction(actions[now + 1 == actions.length ? 0 : now + 1]);
    };
    const getMainButtonText = (act) => {
        const text = {
            init: "shuffle",
            shuffle: "play",
            play: "playing",
            solved: "solved"
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
                                onClick={updateCubeAction}
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
    const rotateCube = (direction) => {
        if (direction == "up") {
            setCubeRotate([cubeRotate[0] + 90, cubeRotate[1]]);
        } else {
            const sign = Math.floor((cubeRotate[0] + 35) / 180) % 2 == 0 ? 1 : -1;
            const direct = direction == "left" ? -1 : 1;
            setCubeRotate([cubeRotate[0], cubeRotate[1] + (90 * sign * direct)]);
        }
    }
    return (
        <ViewControl>
            <div className={`view-button turn-left`} onClick={() =>rotateCube("left")}>
                <Icon asset="tb" icon="ArrowBigLeftFilled" />
            </div>
            <div className={`view-button turn-up`} onClick={() =>rotateCube("up")}>
                <Icon asset="tb" icon="ArrowBigUpLineFilled" />
            </div>
            <div className={`view-button turn-right`} onClick={() =>rotateCube("right")}>
                <Icon asset="tb" icon="ArrowBigRightFilled" />
            </div>
        </ViewControl>
    );
}

function CubeSwapControl() {
    const [cubeCommand, setCubeCommand] = useCubeCommand();
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
                                    onClick={() => appendCommand(word)}
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

export default CubeController;