import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import langEn from "@constants/lang/lang.en";
import langKo from "@constants/lang/lang.ko";

const resources = {
    "en-US": {
        translations: langEn,
    },
    "ko-KR": {
        translations: langKo,
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: resources,
        fallbackLng: {
            "ko-KR": ["ko-KR"],
            default: ["en-US"],
        },
        defaultNS: "translations",
        ns: "translations",
        keySeperator: false,
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
