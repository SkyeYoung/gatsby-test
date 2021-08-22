import theme from "../theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import {ThemeProvider} from "@material-ui/core";

const Provider: React.FC = ({children}) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    )
}

export default Provider
