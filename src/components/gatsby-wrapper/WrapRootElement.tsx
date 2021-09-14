import React from "react";
import {CssBaseline, ThemeProvider} from "@material-ui/core";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {WrapRootElementBrowserArgs} from "gatsby";
import LinkCardContainer from "../LinkCardContainer";
import theme from "../../theme/theme";
import CSSVars from "../CSSVars";

const WrapRootElement = ({element}: WrapRootElementBrowserArgs) => {

    return (
        <React.StrictMode>
            <ToastContainer autoClose={5000}/>
            <CSSVars/>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <LinkCardContainer/>
                {element}
            </ThemeProvider>
        </React.StrictMode>
    )
}

export default WrapRootElement
