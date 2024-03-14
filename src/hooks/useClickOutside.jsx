import { useEffect } from "react";

function useClickOutside(ref, onClickOutside) {
    const handleClickOutside = (e) => {
        e.stopPropagation();
        if(ref.current && !ref.current?.contains(e.target)) {
            onClickOutside();
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside, {once: true});
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, onClickOutside]);
}

export default useClickOutside;