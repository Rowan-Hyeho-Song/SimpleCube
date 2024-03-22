import { useState, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import RadioGroup from "@components/common/radio/RadioGroup";
import Radio from "@components/common/radio/Radio";
import CheckboxGroup from "@components/common/checkbox/CheckboxGroup";
import Checkbox from "@components/common/checkbox/Checkbox";
import Tooltip from "@components/tooltip/Tooltip";
import { useMode, useCubeType, useCustomColor, usePenalty, useLanguage } from "@hooks/SettingProvider";
import { useTheme } from "@hooks/ThemeProvider";
import useClickOutside from "@hooks/useClickOutside";

const Container = styled.div`
    position: relative;
    display: flex;

    .menu-wrapper {
        display: flex;
        height: var(--button-size);
        align-items: center;
        justify-content: center;
        position: absolute;
        left: calc(calc(var(--padding) * 2) + var(--button-size));
        border-radius: 4px;

        .radio-group {
            &.icon {
                label {
                    font-size: calc(var(--button-size) * 0.7);
                    width: var(--button-size);
                    height: var(--button-size);
                    background-color: ${({theme}) => theme.menu.background};
                    color: ${({theme}) => theme.menu.font};

                    @media (hover: hover) and (pointer: fine) { 
                        &:hover {
                            background-color: ${({theme}) => theme.menu.subHoverBackground};
                        }
                    }
                    &.checked {
                        background-color: ${({theme}) => theme.menu.selectBackground};
                    }
                    
                }
                .lang-icon {
                    font-size: 1rem;
                    font-weight: 600;
                }
            }
        }

        .checkbox-group {
            &.icon {
                label {
                    font-size: calc(var(--button-size) * 0.7);
                    width: var(--button-size);
                    height: var(--button-size);
                    background-color: ${({theme}) => theme.menu.background};
                    color: ${({theme}) => theme.menu.font};
                    
                    @media (hover: hover) and (pointer: fine) {
                        &:hover {
                            background-color: ${({theme}) => theme.menu.subHoverBackground};
                        }
                    }
                    &.checked {
                        background-color: ${({theme}) => theme.menu.selectBackground};
                    }

                    &:first-child {
                        border-top-left-radius: 4px;
                        border-bottom-left-radius: 4px;
                    }
                    &:last-child {
                        border-top-right-radius: 4px;
                        border-bottom-right-radius: 4px;
                    }
                }
            }
        }

        .timeLimit {
            font-size: 0;
    
            > svg {
                font-size: calc(var(--button-size) * 0.7);
            }
    
            &.limit-3m::after {    
                content: "3m";
                position: absolute;
                font-size: 1rem;
                top: 0px;
                transform: translate(-1.5rem, 1.3rem);
                font-weight: 700;
                color: red;
            }
            &.limit-1m::after {    
                content: "1m";
                position: absolute;
                font-size: 1rem;
                top: 0px;
                transform: translate(-1.5rem, 1.3rem);
                font-weight: 700;
                color: red;
            }
            &.limit-30s::after {    
                content: "30s";
                position: absolute;
                font-size: 1rem;
                top: 0px;
                transform: translate(-1.5rem, 1.3rem);
                font-weight: 700;
                color: red;
            }
        }
    }
`;

function Dropdown({
    children,
    name,
    menus = [],
}) {
    const [show, setShow] = useState(false);
    const { t } = useTranslation();
    const hooks = {
        theme: useTheme(),
        mode: useMode(),
        cubeType: useCubeType(),
        penalty: usePenalty(),
        customColor: useCustomColor(),
        language: useLanguage()
    };
    const ref = useRef();
    const toggleShow = (e) => {
        e.stopPropagation();
        setShow(!show);
    };
    useClickOutside(ref, () => {
        setShow(false);
    });

    const getMenuItem = (menu, key) => {
        const [value, setValue] = hooks[key];

        if (["radioGroup", "checkboxGroup"].includes(menu.type)) {
            const Group = menu.type == "radioGroup" ? RadioGroup : CheckboxGroup;
            const Menu = menu.type == "radioGroup" ? Radio : Checkbox;
            const cls = menu.type == "radioGroup" ? "radio" : "checkbox";
            const val = cls == "radio" ? { value } : { values: value }

            return (
                <Group
                    className={`${cls}-group`} type="icon" direction="row"
                    key={key} {...val} onChange={setValue}
                >
                    { menu.items && (
                        menu.items.map(({key, value, icon, type}, i) => {

                            return (
                                <Tooltip key={`menu-item-${i}`}
                                    message={t(`setting.tooltip.${key}`)}
                                    direction="BottomLeft" gap={10}>
                                    <Menu type={type} value={value}>{icon}</Menu>
                                </Tooltip>
                            );
                        })
                    )}
                </Group>
            )
        } else {
            return <></>;
        }
    }

    return (
        <Container className={show && "active"} ref={ref}>
            <div onClick={toggleShow}>
                {children}
            </div>
            { show && (
                <div className="menu-wrapper">
                    { menus && (
                        menus.map((menu) => getMenuItem(menu, name))
                    )}
                </div>
            )}
        </Container>
    );
}

export default Dropdown;