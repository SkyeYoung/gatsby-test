import React from "react";
import Box from "@mui/material/Box";

const Footer: React.FC = () => {
    return <Box sx={{
        height: "120px",
        backgroundColor: theme => theme.palette.grey["300"]
    }}/>
}

const FooterMemo = React.memo(Footer, () => true)

export default FooterMemo
