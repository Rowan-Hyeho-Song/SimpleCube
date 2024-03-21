import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Piece from "@components/cube/Piece";
import { getViewMode } from "@utils/MediaQuery";
import { useAction } from "@hooks/CubeProvider";
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
    const [pieces, setPieces] = useState([]);
    const [action, setAction] = useAction();
    const lastestPieces = useRef(pieces);
    const cube = useRef();
    const count = type == "cube3" ? 26 : 8;
    const faces = ["left", "right", "top", "bottom", "back", "front"];
    const colors = ["green", "blue", "white", "yellow", "red", "orange"];
    const viewMode = getViewMode();

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
            assembleCube(newPieces);
            updatePieces(newPieces);
        };
        if (action == "init") {
            initCube();
        }
    }, [type, action]);

    const eventType = EventUtil.getEventType(viewMode);
    const cubeElem = cube?.current;

    // 큐브 위치 변경 이벤트
    const mousedown = (md_e) => {
        md_e.stopPropagation();
        const element = md_e.target.closest(".face");
        const face = [].indexOf.call((element || cubeElem).parentNode.children, element);
        const mousemove = (mm_e) => {
            if (element) {
                const event = EventUtil.getEventByDevice(viewMode, mm_e);
                const gid = /\d/.exec(document.elementFromPoint(event.pageX, event.pageY).id);
                if (gid?.input.includes("anchor")) {
                    const e = element.parentNode.children[mx(face, Number(gid) + 3)].hasChildNodes();
                    animateRotation(mx(face, Number(gid) + 1 + 2 * e), e, lastestPieces.current, Date.now());
                    mouseup();
                }
            }
        };
        const mouseup = () => {
            container.current.appendChild(guide.current);
            cubeElem.removeEventListener(eventType.mousemove, mousemove);
            cubeElem.removeEventListener(eventType.mouseup, mouseup);
            cubeElem.addEventListener(eventType.mousedown, mousedown);
        };
        (element || container.current).appendChild(guide.current);
        cubeElem.addEventListener(eventType.mousemove, mousemove);
        cubeElem.addEventListener(eventType.mouseup, mouseup);
        cubeElem.removeEventListener(eventType.mousedown, mousedown);
    };

    // Piece의 변경이 있을때
    useEffect(() => {
        // 큐브가 정답인지 확인
        if (action === "play") {
            const check = {
                left: [], right: [],
                top: [], bottom: [],
                back: [], front: []
            };
            pieces.forEach((piece) => {
                faces.forEach((face) => {
                    const color = piece.stickers[face];
                    color && check[face].push(color);
                });
            });
            const isSolved = Object.values(check).every((arr) => new Set(arr).size === 1);
            isSolved && setAction("solved");
        } else {
            // 셔플 중인 상태에서는 큐브 위치 변경이 안되도록 이벤트 할당 제한
            lastestPieces.current = pieces;
            if (action !== "shuffle") {
                cubeElem?.addEventListener(eventType.mousedown, mousedown);
            }
            return () => {
                cubeElem?.removeEventListener(eventType.mousedown, mousedown);
            };
        }
    }, [pieces])

    useEffect(() => {
        if (action == "shuffle") {
            shuffleCube();
        } else if (action == "play") {
            cubeElem?.addEventListener(eventType.mousedown, mousedown);
        }
    }, [action]);

    // 각 조각의 위치를 배치하고, 고유한 id와 sticker 부착
    const assembleCube = (pieces) => {
        // 움직임을 지정할때마다 id값에 변화를 줘서 특정 조건으로 id를 찾을 수 있게 적용
        const moveTo = (face) => {
            id = id + (1 << face);
            pieces[i].stickers[faces[face]] = colors[face];

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
