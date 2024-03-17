import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Piece from "@components/cube/Piece";

const SCCube = styled.div`
    font-size: calc(var(--cube-scale) * 100%);
    margin-top: calc(var(--cube-size) / -2);
    margin-left: calc(var(--cube-size) / -2);

    &.shuffle {
        pointer-events: none;
    }
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
    type,
    action,
    guide,
    container
}) {
    const [pieces, setPieces] = useState([]);
    const [answer, setAnswer] = useState("");
    const cube = useRef();
    const count = type == "cube3" ? 26 : 8;
    const faces = ["left", "right", "top", "bottom", "back", "front"];

    const updatePieces = (value, saveAnswer = false) => {
        setPieces(value);
        saveAnswer && setAnswer(JSON.stringify(value));
    };

    // 큐브 조각 초기화
    useEffect(() => {
        const initCube = () => {
            const newPieces = [...Array(count)].map(($, i) => {
                return { 
                    key: `piece${i}`, 
                    stickers: {
                        left: false, right: false,
                        top: false, bottom: false,
                        back: false, front: false
                    }, 
                    style: {} 
                };
            });
            assembleCube(newPieces);
            updatePieces(newPieces, true);
        };
        initCube();
    }, [type]);

    useEffect(() => {
        cube?.current?.addEventListener("mousedown", mousedown);
        return () => {
            cube?.current?.removeEventListener("mousedown", mousedown);
        };
    }, [pieces])

    useEffect(() => {
        if (action == "shuffle") {
            shuffleCube();
        }
    }, [action]);

    const mousedown = (md_e) => {
        const element = md_e.target.closest(".face");
        const face = [].indexOf.call((element || cube.current).parentNode.children, element);
        const mousemove = (mm_e) => {
            if (element) {
                const gid = /\d/.exec(document.elementFromPoint(mm_e.pageX, mm_e.pageY).id);
                if (gid?.input.includes("anchor")) {
                    mouseup();
                    const e = element.parentNode.children[mx(face, Number(gid) + 3)].hasChildNodes();
                    animateRotation(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
                }
            }
        };
        const mouseup = () => {
            container.current.appendChild(guide.current);
            cube.current.removeEventListener("mousemove", mousemove);
            cube.current.removeEventListener("mouseup", mouseup);
            cube.current.addEventListener("mousedown", mousedown);
        };
        (element || container.current).appendChild(guide.current);
        cube.current.addEventListener("mousemove", mousemove);
        cube.current.addEventListener("mouseup", mouseup);
        cube.current.removeEventListener("mousedown", mousedown);
    };

    // 각 조각의 위치를 배치하고, 고유한 id와 sticker 부착
    const assembleCube = (pieces) => {
        const moveTo = (face) => {
            id = id + (1 << face);
            pieces[i].stickers[faces[face]] = faces[face];

            const val = type === "cube2" ? 1.5 : 2;
            return `translate${getAxis(face)}(${face % 2 === 0 ? -val : val}em) `;
        };
        // 0~5 : center, 6~17: edge, 18~26: corner
        for (var id, x, i = 0; id = 0, i < count; i++) {
            if (type === "cube3") {
                x = mx(i, i % 18);
                pieces[i].style.transform = "rotateX(0deg) " + moveTo(i % 6)
                    + (i > 5 ? moveTo(x) + (i > 17 ? moveTo(mx(x, x + 2)) : "") : "");
            } else {
                x = mx(i, i % 4);
                pieces[i].style.transform = "rotateX(0deg) " + moveTo(i % 6) + moveTo(x) + moveTo(mx(x, x + 2));
            }
            pieces[i].id = `piece${id}`;
        }
    };

    // 조건에 만족하는 piece의 index, id 반환
    const getPieceBy = (face, index, corner) => {
        if (type === "cube2") {
            corner = 1;
        }
        const id = ((1 << face) + (1 << mx(face, index)) + (1 << mx(face, index + 1)) * corner);
        const i = pieces.findIndex((piece) => piece.id === `piece${id}`);
        return { id, index: i };
    };

    const swapPieces = (face, times) => {
        const n = type === "cube3" ? 6 : 3;
        const divider = type === "cube3" ? 2 : 1;
        for (let i = 0; i < n * times; i++) {
            const pieceA = getPieceBy(face, i / divider, i % 2);
            const pieceB = getPieceBy(face, i / divider + 1, i % 2);


            // 모든 sticker 서로 swap
            for (let j = 0; j < 5; j++) {
                const a = faces[j < 4 ? mx(face, j) : face];
                const b = faces[j < 4 ? mx(face, j + 1) : face];
                const stickerA = pieces[pieceA.index].stickers[a];
                const stickerB = pieces[pieceB.index].stickers[b];
                const className = stickerA;
                if (className) {
                    pieces[pieceA.index].stickers[a] = stickerB;
                    pieces[pieceB.index].stickers[b] = stickerA;
                }
            }
        }
        updatePieces(pieces);
    };

    // 큐브 섞기
    const shuffleCube = () => {
        // 10 ~ 20 회 중 랜덤
        const times = Math.floor((Math.random() * 10) + 10);
        for(let i = 0; i < times; i++) {
            const clockwise = Math.floor(Math.random());
            const face = Math.floor(Math.random() * 6);
            swapPieces(face, 3 - 2 * clockwise);
        }
        updatePieces(JSON.parse(JSON.stringify(pieces)));
    };

    // 회전 애니메이션
    const animateRotation = (face, clockwise, currentTime) => {
        const k = 0.3 * (face % 2 * 2 - 1) * (2 * clockwise - 1);
        const cubes = Array(9).fill(face).map((value, i) => {
            return i ? getPieceBy(face, i / 2, i % 2).index : value;
        });
        const rotatePieces = () => {
            const passed = Date.now() - currentTime;
            const style = `rotate${getAxis(face)}(${k * passed * (passed < 300)}deg)`;

            const newPieces = pieces.map((piece, i) => {
                if (cubes.includes(i)) {
                    const updatePiece = JSON.parse(JSON.stringify(piece));
                    updatePiece.style.transform = updatePiece.style.transform.replace(/rotate.\(\S+\)/, style);
                    return updatePiece;
                }
                return piece;
            });

            if (passed < 300) {
                requestAnimationFrame(rotatePieces);
                updatePieces(newPieces);
            } else {
                swapPieces(face, 3 - 2 * clockwise);
            }
        };
        rotatePieces();
    };

    return (
        <SCCube ref={cube} className={`cube ${action}`}>
            { pieces && 
                pieces.map((props) => {
                    return (
                        <Piece {...props} />
                    );
                })
            }
        </SCCube>
    );
}

export default Cube;
