import styled, { css } from "styled-components";
import { useCustomColor, usePenalty } from "@hooks/SettingProvider";
import { useAction } from "@hooks/CubeProvider";

// rotate: [x, y, z]
const faces = [
    { position: "left", rotate: [0, -90, 180], color: "green" },
    { position: "right", rotate: [0, 90, 90], color: "blue"},
    { position: "top", rotate: [90, 0, 180], color: "white" },
    { position: "bottom", rotate: [-90, 0, -90], color: "yellow" },
    { position: "back", rotate: [0, 180, -90], color: "red" },
    { position: "front", rotate: [0, 0, 0], color: "orange" },
];

const SCPiece = styled.div`
    --base-color: ${({theme}) => theme.cubeBase};
    width: calc(var(--cube-size) - 0.1em);
    height: calc(var(--cube-size) - 0.1em);

    .face {
        width: 100%;
        height: 100%;
        background-color: var(--base-color);
        border: 0.05em solid var(--base-color);
        border-radius: 10%;

        ${faces.map(({ position, rotate }) => {
            const [x, y, z] = rotate;
            return css`
                &.${position} {
                    transform: rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg) translateZ(calc(var(--cube-size) / 2));
                }
            `;
        })}

        > .sticker {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            
            transform: translateZ(2px);
            width: 90%;
            height: 90%;
            border-radius: 10%;

            ${({theme, $custom}) => {
                const face = theme.faceColor;
                return faces.map(({ color }) => {
                    const bgColor = $custom[color] || face[color];
                    return css`
                        &.${color} {
                            background-color: ${bgColor};
                        }
                    `;
                });
            }}

            &.blind {
                > div {
                    width: 100%;
                    height: 100%;
                    border-radius: 10%;
                    background-color: #0ef;
                    opacity: 1;
                    transform: translateZ(2px) scale(0.6);
                    z-index: 10;

                    &:not(.base) {
                        animation: pulseAnimate 3s ease-out infinite;
                        animation-delay: calc(1s * var(--i));
                        z-index: var(--i);
                    }
                }
            }
        }
    }
`;

function Piece({
    id,
    style = {},
    stickers = { left: false, right: false, top: false, bottom: false, back: false, front: false }
}) {
    const [customColor] = useCustomColor();
    const [penalty] = usePenalty();
    const [action] = useAction(); 
    const getCubeTypeClass = () => {
        let cls;
        const stickerCount  = Object.values(stickers).filter((bool) => bool).length;
        switch(stickerCount) {
            case 1: 
                cls = "center"; break;
            case 2:
                cls = "edge"; break;
            case 3:
                cls = "corner"; break;
        }
        return cls;
    }
    return (
        <SCPiece id={id} className={getCubeTypeClass()} 
            style={style} $custom={customColor} 
        >
            {faces.map(({position}) => {
                const hasSticker = stickers[position];
                const isBlind = penalty.includes("blind") && ["play", "solved"].includes(action);
                return (
                    <div key={position} className={`face ${position}`}>
                        { hasSticker && (
                            <div className={`sticker ${isBlind ? "blind" : stickers[position]}`}>
                                {
                                    isBlind && (
                                        <>
                                            <div className="base"></div>
                                            <div style={{"--i": 0}}></div>
                                            <div style={{"--i": 1}}></div>
                                            <div style={{"--i": 2}}></div>
                                        </>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </SCPiece>
    );
}

export default Piece;