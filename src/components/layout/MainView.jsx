import { useState } from "react";
import styled from "styled-components";
import CubeContainer from "@components/cube/CubeContainer";


const MainContainer = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${({theme}) => theme.background};
`;

function MainView() {
    return (
        <MainContainer>
        </MainContainer>
    );
}

export default MainView;