import { useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { getViewMode } from "@utils/MediaQuery";
import { settingMenu } from "@hooks/SettingProvider";
import Dropdown from "@components/common/Dropdown";
import Tooltip from "@components/tooltip/Tooltip";

const Container = styled.div`
    position: absolute;
    background-color: ${({theme}) => theme.menu.background};
    color: ${({theme}) => theme.menu.font};
    z-index: 10;

    &.Pc, &.Tablet {
        --width: 60px;
        --padding: 10px;
        --button-size: 40px;
    }
    &.Mobile {
        --width: 40px;
        --padding: 5px;
        --button-size: 30px;
    }

    .setting-wrapper {
        position: relative;
        width: var(--width);
        height: 100vh;
        padding: var(--padding);
        > div {
            border-radius: 4px;
            margin-bottom: var(--padding);

            &.active {
                background-color: ${({theme}) => theme.menu.activeBackground};
                color: ${({theme}) => theme.menu.activeFont};

                .setting-item-tooltip {
                    pointer-events: none;
                }
            }
        }
        .button {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: var(--button-size);
            height: var(--button-size);
            border-radius: 4px;

            &.active {
                background-color: ${({theme}) => theme.menu.activeBackground};
            }

            &:hover {
                background-color: ${({theme}) => theme.menu.hoverBackground};
                cursor: pointer;
            }

            > svg {
                font-size: calc(var(--button-size) * 0.7);
            }
        }
    }

`;

function SettingBar() {
    const { t } = useTranslation();
    const viewMode = getViewMode();
    const gap = { Pc: 20, Tablet: 20, Mobile: 10 };

    const ref = useRef();

    const getSettingItem = (item, i) => {
        const fn = {
            dropdown: (children) => {
                return (
                    <Dropdown key={`setting-item-${i}`} name={item.key} menus={item.menus}>{children}</Dropdown>
                );
            },
            default: (children) => children
        };
        return fn[item.type] || fn.default;
    }
    return (
        <Container className={viewMode}>
            <div className="setting-wrapper">
                { settingMenu &&
                    settingMenu.map((item, i) => {
                        const contents = getSettingItem(item, i);
                        return (
                            <> 
                                {contents(
                                    <Tooltip 
                                        key={`setting-item-${i}`} className="setting-item-tooltip" name={item.key}
                                        message={t(`setting.tooltip.${item.key}`)} 
                                        direction="Right" gap={gap[viewMode]}
                                    >
                                        <div className="button">{item.icon}</div>
                                    </Tooltip>
                                )}
                            </>
                        );
                    })
                }
            </div>
        </Container>
    );
}

export default SettingBar;