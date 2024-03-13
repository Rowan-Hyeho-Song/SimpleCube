import { useState } from 'react'
import { ThemeProvider } from '@utils/ThemeProvider';
import Cube from "@components/Cube";

function App() {
    return (
        <ThemeProvider>
            <Cube />
        </ThemeProvider>
    );
}

export default App
