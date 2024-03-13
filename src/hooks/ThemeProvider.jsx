import { useState, createContext, useContext } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import { dark, light } from '@constants/theme';


const ThemeContext = createContext({});

export function getDefaultTheme() {
    const isBrowserDarkMode = useMediaQuery({ query: '(prefers-color-schema: dark)'});
    return window.localStorage.getItem('theme') || isBrowserDarkMode ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
    // check browser theme info
    const initTheme = getDefaultTheme();
    // check local theme info
    const [themeMode, setThemeMode] = useState(initTheme);
    const theme = themeMode === 'light' ? light : dark;

    return (
        <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
            <StyledProvider theme={theme}>
                { children }
            </StyledProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const {themeMode, setThemeMode } = useContext(ThemeContext);
    
    const setMode = (mode) => {
        setThemeMode(mode);
        window.localStorage.setItem('theme', mode);
    };

    const toggleTheme = () => setMode(themeMode === 'light' ? 'dark' : 'light');
    return [themeMode, toggleTheme];
}