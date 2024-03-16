import { useContext } from "react";
import styled from "styled-components";
import CheckboxContext from "@components/common/checkbox/CheckboxContext";

const Container = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;

    input[type="checkbox"] {
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
    .check-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 4px;

        &.checked {
            color: ${({theme}) => theme.checkedColor};
        }
    }
`;

function Checkbox({
    className,
    children,
    type = "checkbox",
    disabled,
    checked,
    value,
    onChange
}) {
    const context = useContext(CheckboxContext);
    const isIcon = type.indexOf("icon") > -1;
    const fn = {
        disabled: disabled,
        checked: checked,
        onChange: ({target: { checked }}) => onChange(checked)
    };

    if (context) {
        const { isDisabled, isChecked, toggleValue } = context;
        fn.disabled = isDisabled(disabled);
        fn.checked = isChecked(value);
        fn.onChange = ({ target: { checked }}) => toggleValue({checked, value});
    }

    return (
        <Container className={`${type} ${fn.checked? "checked" : ""} ${className || ""}`}>
            <input
                type="checkbox" disabled={fn.disabled} checked={fn.checked}
                onChange={fn.onChange}
            />
            { isIcon ? (
                <>{children}</>
            ) : (
                <>
                    <span className={`check-icon ${fn.checked ? "checked" : ""}`}>
                        <Icon icon={fn.checked? "CheckSquareFill" : "Square" } asset="pi" />
                    </span>
                    {children}
                </>
            )}
        </Container>
    );
}

export default Checkbox;