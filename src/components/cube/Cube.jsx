import { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import Piece from "@components/cube/Piece";
import { getViewMode } from "@utils/MediaQuery";
import { useAction, useCubeCommand, useSelectedColor } from "@hooks/CubeProvider";
import { useMode } from "@hooks/SettingProvider";
import ArrayUtil from "@utils/ArrayUtil";
import EventUtil from "@utils/EventUtil";

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
    type,
    guide,
    container
}) {
    const [mode] = useMode();
    const [pieces, setPieces] = useState([]);
    const [action, setAction] = useAction();
    const [cubeCommand, setCubeCommand] = useCubeCommand();
    const [selectedColor, updateSelectedColor] = useSelectedColor();
    const lastestPieces = useRef(pieces);
    const cube = useRef();
    const count = type == "cube3" ? 26 : 8;
    const faces = ["left", "right", "top", "bottom", "back", "front"];
    const commandChar = ["L", "R", "U", "D", "B", "F"];
    const colors = ["green", "blue", "white", "yellow", "red", "orange"];
    const viewMode = getViewMode();
    const eventType = EventUtil.getEventType(viewMode);
    const cubeElem = cube?.current;

    const updatePieces = (value) => {
        setPieces(ArrayUtil.deepCopy(value));
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
            assembleCube(newPieces, mode === "play");
            updatePieces(newPieces);
        };
        if (action == "init") {
            initCube();
        }
    }, [type, action, mode]);

    // Piece의 변경이 있을때
    useEffect(() => {
        lastestPieces.current = pieces;
        
        // 큐브가 정답인지 확인
        if (action === "play") {
            const stickers = getCurrentStickerState();
            const isSolved = Object.values(stickers).every((arr) => new Set(arr).size === 1);
            isSolved && setAction("solved");
        } else {
            // 셔플 중인 상태에서는 큐브 위치 변경이 안되도록 이벤트 할당 제한
            if (!["shuffle", "failed"].includes(action)) {
                if (mode === "play") {
                    cubeElem?.addEventListener(eventType.mousedown, selectMovePiece);
                } else {
                    cubeElem?.addEventListener(eventType.mousedown, selectPieceColor);
                }
            }
            return () => {
                cubeElem?.removeEventListener(eventType.mousedown, selectMovePiece);
                cubeElem?.removeEventListener(eventType.mousedown, selectPieceColor);
            };
        }
    }, [pieces]);

    useEffect(() => {
        if (action == "shuffle") {
            shuffleCube();
        } else if (action == "play") {
            cubeElem?.addEventListener(eventType.mousedown, selectMovePiece);
        }
    }, [action]);

    useEffect(() => {
        if (cubeCommand.length > 0) {
            const command = cubeCommand.shift();
            const clockwise = command.indexOf("'") == -1;
            const face = commandChar.indexOf(command.replace("'", ""));
            animateRotation(face, clockwise, lastestPieces.current, Date.now());
            setCubeCommand([...cubeCommand]);
        }
    }, [cubeCommand]);

    // 현재 piece들의 sticker 상태 반환
    const getCurrentStickerState = () => {
        const stickers = {
            left: [], right: [],
            top: [], bottom: [],
            back: [], front: []
        };
        lastestPieces.current.forEach((piece) => {
            faces.forEach((face) => {
                const color = piece.stickers[face];
                color && stickers[face].push(color);
            });
        });
        return stickers;
    }

    // 각 조각의 위치를 배치하고, 고유한 id와 sticker 부착
    const assembleCube = (pieces, fillColor = false) => {
        // 움직임을 지정할때마다 id값에 변화를 줘서 특정 조건으로 id를 찾을 수 있게 적용
        const moveTo = (face) => {
            id = id + (1 << face);
            pieces[i].stickers[faces[face]] = fillColor ? colors[face] : "empty";

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
        
        if (!fillColor) {
            setAction("selectColor");
            updateSelectedColor("red");
        }
    };

    // 조건에 만족하는 piece의 index, id 반환
    const getPieceBy = (face, index, corner) => {
        corner = type === "cube3" ? corner : 1;
        const id = ((1 << face) + (1 << mx(face, index)) + (1 << mx(face, index + 1)) * corner);
        const i = lastestPieces.current.findIndex((piece) => piece.id === `piece${id}`);
        return { id, index: i };
    };

    const swapPieces = (face, times) => {
        const n = type === "cube3" ? 6 : 3;
        const divider = type === "cube3" ? 2 : 1;
        const piecesList = lastestPieces.current;
        for (let i = 0; i < n * times; i++) {
            const pieceA = getPieceBy(face, i / divider, i % 2);
            const pieceB = getPieceBy(face, i / divider + 1, i % 2);

            // 모든 sticker 서로 swap
            for (let j = 0; j < 5; j++) {
                const a = faces[j < 4 ? mx(face, j) : face];
                const b = faces[j < 4 ? mx(face, j + 1) : face];
                const stickerA = piecesList[pieceA.index].stickers[a];
                const stickerB = piecesList[pieceB.index].stickers[b];
                const className = stickerA;
                if (className) {
                    piecesList[pieceA.index].stickers[a] = stickerB;
                    piecesList[pieceB.index].stickers[b] = stickerA;
                }
            }
        }
        updatePieces(piecesList);
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
    };

    // 큐브 위치 변경 이벤트
    const selectMovePiece = (md_e) => {
        md_e.stopPropagation();
        const element = md_e.target.closest(".face");
        const face = [].indexOf.call((element || cubeElem).parentNode.children, element);
        const setDirection = (mm_e) => {
            if (element) {
                const event = EventUtil.getEventByDevice(viewMode, mm_e);
                const gid = /\d/.exec(document.elementFromPoint(event.pageX, event.pageY).id);
                if (gid?.input.includes("anchor")) {
                    const e = element.parentNode.children[mx(face, Number(gid) + 3)].hasChildNodes();
                    setCubeCommand([
                        ...cubeCommand, 
                        `${commandChar[mx(face, Number(gid) + 1 + 2 * e)]}${e ? "" : "'"}`]
                    );
                    applyMovement();
                }
            }
        };
        const applyMovement = () => {
            container.current.appendChild(guide.current);
            cubeElem.removeEventListener(eventType.mousemove, setDirection);
            cubeElem.removeEventListener(eventType.mouseup, applyMovement);
            cubeElem.addEventListener(eventType.mousedown, selectMovePiece);
        };
        (element || container.current).appendChild(guide.current);
        cubeElem.addEventListener(eventType.mousemove, setDirection);
        cubeElem.addEventListener(eventType.mouseup, applyMovement);
        cubeElem.removeEventListener(eventType.mousedown, selectMovePiece);
    };

    // 풀이 모드에서 조각의 색상 선택 이벤트
    const selectPieceColor = (md_e) => {
        md_e.stopPropagation();
        const element = md_e.target.closest(".face");
        const face = [].indexOf.call((element || cubeElem).parentNode.children, element);
        
        if (element) {
            const id = element.parentNode.id;
            const index = pieces.findIndex((piece) => piece.id === id);
            const piecesList = lastestPieces.current;

            if (piecesList[index].stickers[faces[face]] === "empty") {
                const stickers = getCurrentStickerState();
                const count = type === "cube3" ? 9 : 4;
                const filteredCurrentColor = Object.values(stickers).flat().filter((v) => v === selectedColor);
                if (filteredCurrentColor.length === count - 1) {
                    updateSelectedColor();
                }
                piecesList[index].stickers[faces[face]] = selectedColor;
                setPieces([...piecesList]);
            }
        }
    }

    // 회전 애니메이션
    const animateRotation = (face, clockwise, pieceList, currentTime) => {
        const k = 0.3 * (face % 2 * 2 - 1) * (2 * clockwise - 1);
        const cubes = Array(9).fill(face).map((value, i) => {
            return i ? getPieceBy(face, i / 2, i % 2).index : value;
        });
        const rotatePieces = () => {
            const passed = Date.now() - currentTime;
            const rotate = `rotate${getAxis(face)}(${k * passed * (passed < 300)}deg)`;

            cubes.forEach((index) => {
                const { id, style } = pieceList[index];
                const piece = document.getElementById(id);
                piece.style.transform = style.transform.replace(/rotate.\(\S+\)/, rotate);
            });

            if (passed < 300) {
                requestAnimationFrame(rotatePieces);
            } else {
                swapPieces(face, 3 - 2 * clockwise);
            }
        };
        rotatePieces();
    };

    return (
        <SCCube ref={cube} className={`cube`}>
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
