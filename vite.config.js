import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "/SimpleCube/",
    resolve: {
        alias: [
            { find: "@", replacement: "/src" },
            { find: "@api", replacement: "/src/api" },
            { find: "@assets", replacement: "/src/assets" },
            { find: "@components", replacement: "/src/components" },
            { find: "@constants", replacement: "/src/constants" },
            { find: "@hooks", replacement: "/src/hooks" },
            { find: "@pages", replacement: "/src/pages" },
            { find: "@styles", replacement: "/src/styles" },
            { find: "@utils", replacement: "/src/utils" },
        ],
    },
});
