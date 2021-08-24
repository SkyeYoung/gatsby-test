import React, {useContext} from "react";
import Box from "@material-ui/core/Box";
import Header from "./Header";
import {DeepRequiredNonNull} from "../types/common";
import {I18nContext} from "react-i18next";

const Layout: React.FC<{ data: DeepRequiredNonNull<GatsbyTypes.PostQuery> }> = (props) => {
    const {children, data} = props

    const {i18n} = useContext(I18nContext)

    data.allLocale?.edges?.forEach(({node}) => {
        // if (!i18n.hasResourceBundle(node.language, node.ns)) {
        i18n.addResourceBundle(node.language, node.ns, JSON.parse(node.data))
        // }
    })

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
