import React from "react";
import { css } from "styled-components";
import { useMediaQuery } from "react-responsive";

export const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ query: "(max-width:425px)" });
    return <>{isMobile && children}</>;
};
export const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ query: "(min-width:426px) and (max-width:1024px)" });
    return <>{isTablet && children}</>;
};
export const Pc = ({ children }) => {
    const isPc = useMediaQuery({ query: "(min-width:1025px)" });
    return <>{isPc && children}</>;
};

export const getViewMode = () => {
    const isMobile = useMediaQuery({ query: "((max-width:425px)" });
    const isTablet = useMediaQuery({ query: "(min-width:426px) and (max-width:1024px)" });

    let currentViewMode = "Pc";
    if (isMobile) {
        currentViewMode = "Mobile";
    } else if (isTablet) {
        currentViewMode = "Tablet";
    }

    return currentViewMode;
};

const breakpoints = {
    small: { max: 425 },
    medium: { max: 1024, min: 426 },
    large: { min: 1025 },
};
const breakpointsEntries = Object.entries(breakpoints);
const querys = breakpointsEntries.reduce((acc, [key, value]) => {
    return {
        ...acc,
        [key]: Object.entries(value)
            .map(([k, v]) => `(${k}-width: ${v}px)`)
            .join(" and "),
    };
}, {});

export const media = Object.entries(querys).reduce((acc, [key, value]) => {
    return {
        ...acc,
        [key]: (first, ...interpolations) => css`
            @media screen and ${value} {
                ${css(first, ...interpolations)}
            }
        `,
    };
}, {});

export const getNowBreakPoint = () => {
    const isS = useMediaQuery({ query: querys.small });
    const isM = useMediaQuery({ query: querys.medium });

    if (isS) {
        return "small";
    } else if (isM) {
        return "medium";
    }
    return "large";
};
