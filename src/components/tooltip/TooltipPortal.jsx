import ReactDOM from "react-dom";

function TooltipPortal({ children }) {
    const tooltipRoot = document.getElementById("tooltip-root");
    return ReactDOM.createPortal(children, tooltipRoot);
}

export default TooltipPortal;
