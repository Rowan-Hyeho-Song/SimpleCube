import { useState, useEffect } from "react";
import styled from "styled-components";
import Piece from "@components/cube/Piece";

const SCCube = styled.div`
    font-size: calc(var(--cube-scale) * 100%);
    margin-top: calc(var(--cube-size) / -2);
    margin-left: calc(var(--cube-size) / -2);
`;

// i번째 조각에서 j번째 인접한 조각으로 이동하기 위한 방향 반환
const mx = (i, j) => {
    const moves = [2, 4, 3, 5];
    const numMoves = moves.length;

    const moveIndex = (j % numMoves |0);
    const rotateDirection = i % 2;
    const rotateOffset = ((j|0) % numMoves * 2 + 3);
    const moveOffset = 2 * (i / 2 |0);
    return (moves[moveIndex] + rotateDirection * rotateOffset + moveOffset) % 6;
};
// 주어진 면을 기반으로 해당 면이 어떤 축을 따라 이동하는지 반환
// 0: X, 1: Y, 2: Z
const getAxis = (face) => {
	return String.fromCharCode('X'.charCodeAt(0) + face / 2);
};

function Cube({
    type
}) {
    const [pieces, setPieces] = useState();
    const count = type == "cube3" ? 26 : 8;

    // 큐브 조각 초기화
    useEffect(() => {
        const initCube = () => {
            const newPieces = [...Array(count)].map(($, i) => {
                return { key: `piece${i}`, stickers: [], style: {} };
            });
            assembleCube(newPieces);
            setPieces(newPieces);
        };
        initCube();
    }, [type]);

    // 각 조각의 위치를 배치하고, 고유한 id와 sticker 부착
    const assembleCube = (pieces) => {
        const moveTo = (face) => {
            id = id + (1 << face);
            if (!pieces[i].stickers.includes(face)) {
                pieces[i].stickers.push(face);
            }
            const val = type === "cube2" ? 1.5 : 2;
            return `translate${getAxis(face)}(${face % 2 === 0 ? -val : val}em) `;
        };
        // 0~5 : center, 6~17: edge, 18~26: corner
        // face ==> 0: left, 1: right, 2: top, 3: bottom, 4: back, 5: front
        for (var id, x, i = 0; id = 0, i < count; i++) {
            if (type === "cube3") {
                x = mx(i, i % 18);
                pieces[i].style.transform = "rotateX(0deg)" + moveTo(i % 6)
                    + (i > 5 ? moveTo(x) + (i > 17 ? moveTo(mx(x, x + 2)) : "") : "");
            } else {
                x = mx(i, i % 4);
                pieces[i].style.transform = "rotateX(0deg)" + moveTo(i % 6) + moveTo(x) + moveTo(mx(x, x + 2));
            }
            pieces[i].id = `piece${id}`;
        }
    };

    return (
        <SCCube>
            { pieces && 
                pieces.map((props) => {
                    return (
                        <Piece {...props} />
                    );
                })}
        </SCCube>
    );
}

export default Cube;
