import Header from "./Header";
import React from "react";
import Box from "@material-ui/core/Box";

const Layout: React.FC = (props) => {
    const {children} = props

    return (
        <Box sx={{display: 'flex', flexFlow: 'column'}}>
            <Header/>
            <Box sx={{display: 'flex', flexGrow: 1}}>
                {children}
            </Box>
        </Box>
    )
}

export default Layout
