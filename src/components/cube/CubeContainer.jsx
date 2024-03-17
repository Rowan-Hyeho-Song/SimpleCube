import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Cube from "@components/cube/Cube";
import { SettingContext, useCubeType } from "@hooks/SettingProvider";
import { LuRotate3D } from "react-icons/lu";

const Container = styled.div`
    width: 100%;
    height: 100%;
    perspective: 1200px;
    transform-style: preserve-3d;

    &.cube2 {
        --cube-size: 3em;
        --cube-scale: 2;
    }
    &.cube3 {
        --cube-size: 2em;
        --cube-scale: 2;
    }

    &.enable-transform {
        color: white;
        cursor: url("src/assets/cursor/rotate3d-${({theme}) => theme.cursor}.svg"), auto;
    }

    div {
        position: absolute;
        transform-style: inherit;
    }
`;
const SCPivot = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 0;
    height: 0;
    margin: auto;
    transition: 0.1s;

    .anchor {
        width: var(--cube-size);
        height: calc(var(--cube-size) * 3);
    }
`;
const SCGuide = styled.div`
    .anchor {
        background-color: rgba(255, 0, 0, 0.2);
    }
`;

function Pivot({
    id,
    refer,
    guide,
    container
}) {
    const [cubeType] = useCubeType();
    return (
        <SCPivot 
            id={id} 
            style={{transform: "rotateX(-35deg) rotateY(-45deg)"}} 
            ref={refer}
        >
            <Cube type={cubeType} guide={guide} container={container} />
        </SCPivot>
    );
}

function Guide({
    id,
    refer
}) {
    const rotate = -90;
    const transform = (i) => `translateZ(3px) translateY(-33.33%) rotate(${i * rotate}deg) translateY(66.67%)`;
    return (
        <SCGuide id={id} ref={refer}>
            {[...Array(4)].map(($, i) => {
                return (
                    <div 
                        key={`anchor${i}`}
                        id={`anchor${i}`}
                        className="anchor" 
                        style={{  transform: transform(i) }}
                    ></div>
                );
            })}
        </SCGuide>
    );
}

function CubeContainer({
    cubeSize = 100
}) {
    const [activeTransform, setActiveTransform] = useState(false);
    const [cubeType] = useCubeType();
    const containerRef = useRef();
    const pivotRef = useRef();
    const guideRef = useRef();

    // keydown 이벤트 설정 - spacebar를 누르고 있을때만 transform 이벤트 활성화
    useEffect(() => {
        const keydown = (e) => {
            if (e.keyCode === 32 && !activeTransform) {
                setActiveTransform(true);
                window.addEventListener("keyup", keyup);
            }
        };
        const keyup = (e) => {
            if (e.keyCode === 32) {
                setActiveTransform(false);
                window.removeEventListener("keyup", keyup);
            }
        };
        window.addEventListener("keydown", keydown);
        document.ondragstart = () => { return false; }; 
        return () => {
            window.removeEventListener("keydown", keydown);
        }
    }, []);

    const mousedown = (md_e) => {
        if (activeTransform) {
            const targetStyle = pivotRef.current.style;
            const startXY = targetStyle.transform.match(/-?\d+\.?\d*/g).map(Number);
            const container = containerRef.current;
            const mousemove = (mm_e) => {
                targetStyle.transform = `rotateX(${(startXY[0] - (mm_e.pageY - md_e.pageY) / 2)}deg)` +
                                        `rotateY(${(startXY[1] + (mm_e.pageX - md_e.pageX) / 2)}deg)`;
            };
            const mouseup = () => {
                container.removeEventListener("mousemove", mousemove);
                container.removeEventListener("mouseup", mouseup);
            };
            container.addEventListener("mousemove", mousemove);
            container.addEventListener("mouseup", mouseup);
        }
    };

    return (
        <Container 
            className={`${cubeType} ${activeTransform ? "enable-transform" : ""}`}
            onMouseDown={mousedown}
            ref={containerRef}
        >
            <Pivot id="pivot" refer={pivotRef} guide={guideRef} container={containerRef} />
            <Guide id="guide" refer={guideRef} />
        </Container>
    );
}

export default CubeContainer;