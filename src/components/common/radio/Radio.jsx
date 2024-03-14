import { useContext } from "react";
import styled from "styled-components";
import RadioContext from "@components/common/radio/RadioContext";
import Icon from "@components/common/Icon";

const Container = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;

    input[type="radio"] {
        display: none;
    }
    &.icon {
        padding: 5px;
        cursor: pointer;
        &.checked {
            color: ${({theme}) => theme.checkedFont};
            background-color: ${({theme}) => theme.checkedColor};
        }
    }
    .radio-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 4px;

        &.checked {
            color: ${({theme}) => theme.checkedColor};
        }
    }
`;

function Radio({
    children,
    type = "radio",
    className,
    value,
    name,
    defaultChecked,
    disabled
}) {
    const group = useContext(RadioContext);
    const isIcon = type.indexOf("icon") > -1;
    const checked = group.value === value;
    return (
        <Container className={`${type} ${checked? "checked" : ""} ${className || ""}`}>
            <input 
                type="radio" value={value} name={name} 
                defaultChecked={defaultChecked} disabled={disabled}
                checked={checked}
                onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    group.onChange && group.onChange(e.target.value)
                }}
            />
            { isIcon ? (
                <>{children}</>
            ) : (
                <>
                    <span className={`radio-icon ${checked ? "checked" : ""}`}>
                        <Icon icon={checked? "RadioButtonFill" : "Circle" } asset="pi" />
                    </span>
                    {children}
                </>
            )}
        </Container>
    )
}

export default Radio;