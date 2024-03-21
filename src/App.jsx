import { createElement } from "react";
import { ThemeProvider } from "@hooks/ThemeProvider";
import { SettingProvider } from "@hooks/SettingProvider";
import { CubeProvider } from "@hooks/CubeProvider";
import SettingBar from "@components/setting/SettingBar";
import MainView from "@components/layout/MainView";

// Context들을 합쳐서 적용
const AppProvider = ({ contexts, children }) => contexts.reduce(
    (acc, cur) => createElement(cur, { children: acc }),
    children
);

function App() {
    return (
        <AppProvider contexts={[SettingProvider, ThemeProvider, CubeProvider]}>
            <SettingBar />
            <MainView />
        </AppProvider>
    );
}

export default App
