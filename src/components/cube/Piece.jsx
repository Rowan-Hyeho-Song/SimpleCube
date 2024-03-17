import styled, { css } from "styled-components";
import { useCustomColor } from "@hooks/SettingProvider";

// rotate: [x, y, z]
const faces = [
    { position: "left", rotate: [0, -90, 180] },
    { position: "right", rotate: [0, 90, 90] },
    { position: "top", rotate: [90, 0, 180] },
    { position: "bottom", rotate: [-90, 0, -90] },
    { position: "back", rotate: [0, 180, -90] },
    { position: "front", rotate: [0, 0, 0] },
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
                return faces.map(({ position }) => {
                    const color = $custom[position] || face[position];
                    return css`
                        &.${position}-color {
                            background-color: ${color};
                        }
                    `;
                });
            }}
        }
    }
`;

function Piece({
    id,
    style = {},
    stickers = { left: false, right: false, top: false, bottom: false, back: false, front: false }
}) {
    const [customColor] = useCustomColor();
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
                return (
                    <div key={position} className={`face ${position}`}>
                        { hasSticker && <div className={`sticker ${stickers[position]}-color`}></div>}
                    </div>
                );
            })}
        </SCPiece>
    );
}

export default Piece;