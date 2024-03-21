import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { getViewMode } from "@utils/MediaQuery";
import { useCubeType } from "@hooks/SettingProvider";
import { CubeProvider, useAction } from "@hooks/CubeProvider";
import CubeController from "@components/cube/CubeController";
import Cube from "@components/cube/Cube";
import ConfettiExplosion from "react-confetti-explosion";
import EventUtil from "@utils/EventUtil";

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
// background-color: rgba(255, 0, 0, 0.2);
const SCGuide = styled.div`
    .anchor {
    }
`;

function Pivot({
    id,
    refer,
    guide,
    container
}) {
    const [cubeType] = useCubeType();
    const [action] = useAction();
    
    return (
        <>
            <SCPivot 
                id={id} 
                style={{transform: "rotateX(-35deg) rotateY(-45deg)"}} 
                ref={refer}
            >
                <Cube 
                    type={cubeType}
                    guide={guide} container={container} />
                {action === "solved" && <ConfettiExplosion />}
            </SCPivot>
        </>
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
}) {
    const [cubeType] = useCubeType();
    const containerRef = useRef();
    const pivotRef = useRef();
    const guideRef = useRef();
    const viewMode = getViewMode();
    const eventType = EventUtil.getEventType(viewMode);

    // keydown 이벤트 설정 - spacebar를 누르고 있을때만 transform 이벤트 활성화
    useEffect(() => {
        const onDragStart = () => { return false; };
        document.ondragstart = onDragStart; 
        return () => {
            document.ondragstart = null;
        }
    }, []);

    const mousedown = (md_e) => {
        const md_event = EventUtil.getEventByDevice(viewMode, md_e);
        const targetStyle = pivotRef.current.style;
        const startXY = targetStyle.transform.match(/-?\d+\.?\d*/g).map(Number);
        const container = containerRef.current;
        const mousemove = (mm_e) => {
            const mm_event = EventUtil.getEventByDevice(viewMode, mm_e);
            targetStyle.transform = `rotateX(${(startXY[0] - (mm_event.pageY - md_event.pageY) / 2)}deg)` +
                                    `rotateY(${(startXY[1] + (mm_event.pageX - md_event.pageX) / 2)}deg)`;
        };
        const mouseup = () => {
            container.removeEventListener(eventType.mousemove, mousemove);
            container.removeEventListener(eventType.mouseup, mouseup);
        };
        container.addEventListener(eventType.mousemove, mousemove);
        container.addEventListener(eventType.mouseup, mouseup);
    };

    return (
        <CubeProvider>
            <Container 
                className={`${cubeType}`}
                onMouseDown={mousedown}
                onTouchStart={mousedown}
                ref={containerRef}
            >
                <Pivot id="pivot" refer={pivotRef} guide={guideRef} container={containerRef} />
                <CubeController />
                <Guide id="guide" refer={guideRef} />
            </Container>
        </CubeProvider>
    );
}

export default CubeContainer;