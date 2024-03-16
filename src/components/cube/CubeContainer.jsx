import styled from "styled-components";
import Cube from "@components/cube/Cube";
import { SettingContext, useCubeType } from "@hooks/SettingProvider";

const Container = styled.div`
    width: 100%;
    height: 100%;
    perspective: 1200px;
    transform-style: preserve-3d;

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
`;
const SCGuide = styled.div`
    .anchor {
        width: 2em;
        height: calc(2em * 3);
    }
`;

function Pivot({
    id
}) {
    const [cubeType] = useCubeType();
    return (
        <SCPivot id={id} style={{transform: "rotateX(-35deg) rotateY(-45deg)"}}>
            <Cube type={cubeType} />
        </SCPivot>
    );
}

function Guide({
    id
}) {
    const rotate = -90;
    const transform = (i) => `translateZ(3px) translateY(-33.33%) rotate(${i * rotate}deg) translateY(66.67%)`;
    return (
        <SCGuide id={id}>
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
    return (
        <Container>
            <Pivot id="pivot" />
            <Guide id="guide" />
        </Container>
    );
}

export default CubeContainer;