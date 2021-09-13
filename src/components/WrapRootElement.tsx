import theme from "../theme/theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import {ThemeProvider} from "@material-ui/core";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {WrapRootElementBrowserArgs} from "gatsby";
import LinkCardContainer from "./LinkCardContainer";
import Palette from "./Palette";

const WrapRootElement = ({element}: WrapRootElementBrowserArgs) => {

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <Palette/>
                <CssBaseline/>
                <ToastContainer autoClose={5000}/>
                <LinkCardContainer/>
                {element}
            </ThemeProvider>
        </React.StrictMode>
    )
}

export default WrapRootElement
