import styled from "styled-components";

const CubeContainer = styled.div`
    &.cube {
        position: relative;
        --cube-size: 100px;
        width: var(--cube-size);
        height: var(--cube-size);
        transform-style: preserve-3d;

        div {
            position: absolute;
            width: var(--cube-size);
            height: var(--cube-size);
        }
        .cube-side {
            --pos-val: calc(var(--cube-size) / -2);
            opacity: 0.7;

            &.bottom {
                bottom: var(--pos-val);
                left: 0;
                background-color: #cc0000;
                transform: rotateX(90deg);
            }
            &.top {
                top: var(--pos-val);
                left: 0;
                background-color: #ee6600;
                transform: rotateX(90deg);
            }
            &.back {
                top: 0;
                left: 0;
                background-color: #009922;
                transform: translateZ(var(--pos-val));
            }
            &.right {
                right: var(--pos-val);
                background-color: #ffcc00;
                transform: rotateY(90deg);
            }
            &.left {
                left: var(--pos-val);
                background-color: #2255dd;
                transform: rotateY(90deg);
            }
            &.front {
                top: 0;
                left: 0;
                background-color: #ffffff;
                transform: translateZ(calc(var(--pos-val) * -1));
            }
        }
    }
`;

function Cube() {
    return (
        <CubeContainer className="cube">
            <div className="cube-side bottom"></div>
            <div className="cube-side top"></div>
            <div className="cube-side back"></div>
            <div className="cube-side right"></div>
            <div className="cube-side left"></div>
            <div className="cube-side front"></div>
        </CubeContainer>
    );
}

export default Cube;