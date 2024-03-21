import { useState, useEffect} from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useAction } from "@hooks/CubeProvider";
import { useMode, useCubeType } from "@hooks/SettingProvider";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    bottom: 20%;
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

function CubeController() {
    const [cubeType] = useCubeType();
    const [mode] = useMode();
    const [action, setAction] = useAction();
    const { t } = useTranslation();

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
                            <>
                            </>
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

export default CubeController;