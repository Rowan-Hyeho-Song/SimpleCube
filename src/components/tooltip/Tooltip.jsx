import { useState, useRef } from "react";
import styled from "styled-components";
import { debounce } from "lodash";
import TooltipPortal from "@components/tooltip/TooltipPortal";
import TooltipBox from "@components/tooltip/TooltipBox";

const Container = styled.div`
`;

const opposite = {
    TopLeft: "BottomLeft",
    Top: "Bottom",
    TopRight: "BottomRight",
    LeftTop: "RightTop",
    Left: "Right",
    LeftBottom: "RightBottom",
    BottomLeft: "TopLeft",
    Bottom: "Top",
    BottomRight: "TopRight",
    RightTop: "LeftTop",
    Right: "Left",
    RightBottom: "LeftBottm",
};
const getPosition = (ref, direction, gap) => {
    const target = ref.current;
    let { top, left } = target?.getBoundingClientRect() || { top: 0, left: 0 };
    const targetOffset = { width: target?.clientWidth, height: target?.clientHeight };
    // const screenOffset = { width: window.innerWidth, height: window.innerHeight };

    let t;
    if (direction.indexOf("Top") == 0 || direction.indexOf("Bottom") == 0) {
        if (direction.indexOf("Top") == 0) {
            top -= gap;
            t = "Top";
        } else {
            top += targetOffset.height + gap;
            t = "Bottom";
        }
        switch (direction) {
            case `${t}`: 
                left += targetOffset.width / 2;
                break;
            case `${t}Right`:
                left += targetOffset.width;
                break;
        }
    } else {
        if (direction.indexOf("Left") == 0) {
            left -= gap;
            t = "Left";
        } else {
            left += targetOffset.width + gap;
            t = "Right";
        }
        switch (direction) {
            case `${t}`: 
                top += targetOffset.height / 2;
                break;
            case `${t}Bottom`:
                top += targetOffset.height;
                break;
        }
    }
    return { 
        style: { top, left },
        direction
    };
};

function Tooltip({
    children,
    message,
    className = "",
    direction = "Top",
    delay = 0,
    gap = 5,
}) {
    const [show, setShow] = useState(false);
    const ref = useRef();
    const pos = useRef();

    const handleMouseOver = debounce(() => {
        pos.current = getPosition(ref, direction, gap);
        className.indexOf("disabled") > -1 || setShow(true);
    }, delay);
    const handlMouseLeave = () => {
        setShow(false);
        handleMouseOver.cancel();
    };

    return (
        <Container
            ref={ref}
            onMouseOver={handleMouseOver}
            onMouseLeave={handlMouseLeave}
            className={className}
        >
            {children}
            { show &&
                <TooltipPortal>
                    <TooltipBox className="tooltip-box" message={message} style={pos.current?.style} direction={pos.current?.direction} />
                </TooltipPortal>
            }
        </Container>
    );
}

export default Tooltip;