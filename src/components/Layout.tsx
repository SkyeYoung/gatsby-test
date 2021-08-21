import Header from "./Header";
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";

const Layout: React.FC = (props) => {
    return (
        <>
            <CssBaseline/>

            <Box sx={{display: 'flex', flexFlow: 'column'}}>

                <Header/>

                <Box sx={{display: 'flex', flexGrow: 1}}>
                    {props.children}
                </Box>
            </Box>
        </>
    )
}

export default Layout
