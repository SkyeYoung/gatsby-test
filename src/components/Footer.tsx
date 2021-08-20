import Box from "@material-ui/core/Box";
import React from "react";

const Footer: React.FC = () => {
    return <Box sx={{
        height: "120px",
        backgroundColor: theme => theme.palette.grey["300"]
    }}/>
}

const FooterMemo = React.memo(Footer, () => true)

export default FooterMemo
