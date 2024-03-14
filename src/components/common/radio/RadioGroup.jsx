import styled from "styled-components";
import RadioContext from "@components/common/radio/RadioContext";

const Container = styled.fieldset`
    display: flex;
    border: 0;
    padding: 0;
    margin: 0;
    flex-direction: ${({direction}) => direction};

    &.radio {
        label:not(:last-child) {
            margin-right: ${({direction}) => direction == "row" ? "8px" : ""};
        }
    }
    &.icon {
        label:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }
        label:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    }
`;

function RadioGroup({
    className,
    children,
    type = "radio",
    direction = "column",
    ...rest
}) {
    return (
        <Container
            className={`${type} ${className || ""}`}
            direction={direction}
        >
            <RadioContext.Provider value={{...rest}}>{children}</RadioContext.Provider>
        </Container>
    );
}

export default RadioGroup;