import styled from "styled-components";
import CheckboxContext from "@components/common/checkbox/CheckboxContext";

const Container = styled.fieldset`
    display: flex;
    border: 0;
    padding: 0;
    margin: 0;
    flex-direction: ${({direction}) => direction};
`;

function CheckboxGroup({
    className,
    children,
    type = "checkbox",
    values,
    direction = "column",
    disabled: groupDisabled,
    onChange
}) {
    const isDisabled = (disabled) => disabled || groupDisabled;
    const isChecked = (value) => values.includes(value);
    const toggleValue = ({ checked, value}) => {
        if (checked) {
            onChange(values.concat(value));
        } else {
            onChange(values.filter((v) => v !== value));
        }
    };

    return (
        <Container
            className={`${type} ${className || ""}`}
            direction={direction}
        >
            <CheckboxContext.Provider value={{ isDisabled, isChecked, toggleValue}}>
                {children}
            </CheckboxContext.Provider>
        </Container>
    );
}

export default CheckboxGroup;