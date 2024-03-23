import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
    text-align: center;
    font-size: 2rem;
    pointer-events: none;
    color: ${({theme}) => theme.font};
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
`;

const padZero = (value, num = 2) => {
    return String(value).padStart(num, "0");
};
const formatTime = (timestamp) => {
    const h = Math.floor(timestamp / 3600000);
    const m = Math.floor((timestamp % 3600000) / 60000);
    const s = Math.floor((timestamp % 60000) / 1000);
    const ms = Math.floor((timestamp % 1000)/10);
    const formattedTime = `${padZero(h)}:${padZero(m)}:${padZero(s)}.${padZero(ms)}`;
    return formattedTime;
};

function Timer({
    className,
    type = "timer",
    start = 0,
    active = false,
    setActive = () => {},
    interval = 1000,
}) {
    const [time, setTime] = useState(start);
    const timeRef = useRef();

    const stopwatch = () => {
        setTime((prev) => prev + interval);
    };
    const timer = () => {
        setTime((prev) => {
            return prev - interval;
        });
    };

    useEffect(() => {
        setTime(start);
    }, [start]);
    useEffect(() => {
        toggleTimer(active);
    }, [active]);
    useEffect(() => {
        if (type === "timer") {
            if (time <= 0) {
                setActive("timeout");
            }
        }
    }, [time]);

    const toggleTimer = (state) => {
        if ([true, "start"].includes(state)) {
            timeRef.current = setInterval((type === "timer" ? timer : stopwatch), interval);
        } else {
            clearInterval(timeRef.current);
            if (state !== "saveRecords") {
                setTime(start);
            }
        }
    };

    return (
        <Container className={`${type} ${className}`}>
            {formatTime(time)}
        </Container>
    );
}

export default Timer;