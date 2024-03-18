
const eventType = {
    Pc: {
        mousedown: "mousedown",
        mousemove: "mousemove",
        mouseup: "mouseup"
    },
    Tablet: {
        mousedown: "touchstart",
        mousemove: "touchmove",
        mouseup: "touchend"
    },
    Mobile: {
        mousedown: "touchstart",
        mousemove: "touchmove",
        mouseup: "touchend"
    },
};

export default {
    getEventType: (mode = "Pc", type = null) => {
        const types = eventType[mode];
        return type ? types[type] : types;
    },
    getEventByDevice: (mode = "Pc", event) => {
        if (mode !== "Pc") {
            return (event.changedTouches || event.touches)[0];
        }
        return event;
    },
};