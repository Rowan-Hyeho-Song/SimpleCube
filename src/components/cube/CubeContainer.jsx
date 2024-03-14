import styled from "styled-components";
import Cube from "@components/cube/Cube";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    perspective: 400px;
`;

function CubeContainer({
    cubeSize = 100
}) {
    return (
        <Container>
        </Container>
    );
}

export default CubeContainer;