import React, { useEffect } from "react";



const WindowFocusHandler = ({onFocus, onBlur}) => {
    useEffect(() => {
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);
        // Calls onFocus when the window first loads
        onFocus();
        // Specify how to clean up after this effect:
        return () => {
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
        };
  }, []);

    return <></>;
};

export default WindowFocusHandler;

