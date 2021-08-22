import Header from "./Header";
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import {ThemeProvider} from "@material-ui/core";
import theme from "../theme";

const Layout: React.FC = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>

            <Box sx={{display: 'flex', flexFlow: 'column'}}>

                <Header/>

                <Box sx={{display: 'flex', flexGrow: 1}}>
                    {props.children}
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Layout
