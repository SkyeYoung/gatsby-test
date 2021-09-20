import React from "react";
import CssBaseline from "@mui/material/CssBaseline"
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {WrapRootElementBrowserArgs} from "gatsby";
import LinkCardContainer from "../LinkCardContainer";
import {theme} from "../../theme";
import StoreHandler from "../StoreHandler";

const WrapRootElement = ({element}: WrapRootElementBrowserArgs) => {

    return (
        <React.StrictMode>
            <StoreHandler/>
            <ToastContainer autoClose={5000}/>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <LinkCardContainer/>
                {element}
            </ThemeProvider>
        </React.StrictMode>
    )
}

export default WrapRootElement
