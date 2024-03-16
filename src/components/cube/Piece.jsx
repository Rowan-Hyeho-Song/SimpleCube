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
    width: calc(2em - 0.1em);
    height: calc(2em - 0.1em);

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
                    transform: rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg) translateZ(calc(2em / 2));
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
            width: 95%;
            height: 95%;
            border-radius: 10%;

            ${({theme, custom}) => {
                const face = theme.faceColor;
                return faces.map(({ position }) => {
                    const color = custom[position] || face[position];
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
    stickers = []
}) {
    const [customColor] = useCustomColor();
    return (
        <SCPiece id={id} style={style} custom={customColor}>
            {faces.map(({position}, i) => {
                const hasSticker = stickers.includes(i);
                return (
                    <div key={position} className={`face ${position}`}>
                        { hasSticker && <div className={`sticker ${position}-color`}></div>}
                    </div>
                );
            })}
        </SCPiece>
    );
}

export default Piece;