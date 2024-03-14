import styled, { keyframes } from "styled-components";

const popup = keyframes`
0% {
    opacity: 0;
}
100% {
    opacity: 1;
}
`;

const Container = styled.div`
    position: absolute;
    background-color: #000000;
    color: #ffffff;
    padding: 5px 10px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;

    animation: ${popup} 0.3s forwards;

    &.TopLeft {
        transform: translate(0, -100%);
    }
    &.Top {
        transform: translate(-50%, -100%);
    }
    &.TopRight {
        transform: translate(-100%, -100%);
    }

    &.LeftTop {
        transform: translate(-100%, 0);
    }
    &.Left {
        transform: translate(-100%, -50%);
    }
    &.LeftBottom {
        transform: translate(-100%, -100%);
    }

    &.RightTop {
        transform: translate(0, 0);
    }
    &.Right {
        transform: translate(0, -50%);
    }
    &.RightBottom {
        transform: translate(0, -100%);
    }

    &.BottomLeft {
        transform: translate(0, 0);
    }
    &.Bottom {
        transform: translate(-50%, 0);
    }
    &.BottomRight {
        transform: translate(-100%, 0);
    }
`;

function TooltipBox({
    style,
    message,
    direction
})  {
    return (
        <Container className={direction} style={style}>
            {message}
        </Container>
    );
}

export default TooltipBox;