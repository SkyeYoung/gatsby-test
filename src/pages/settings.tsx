import React from "react";
import {DeepRequiredNonNull} from "../types/common";
import {Helmet} from "react-helmet";
import Box from "@material-ui/core/Box";
import {graphql, useStaticQuery} from "gatsby";
import Palettes from "../components/setting/Palettes";

const Setting: React.FC = () => {
    const {site} = useStaticQuery<GatsbyTypes.SiteBasicInfoQuery>(graphql`
        query SiteBasicInfo {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `) as DeepRequiredNonNull<GatsbyTypes.SiteBasicInfoQuery>

    const siteTitle = site.siteMetadata.title

    return (
        <>
            <Helmet title={`settings - ${siteTitle}`}/>

            <Box sx={{display: 'flex', flexFlow: 'column'}}>
                <Box sx={{display: 'flex', flexGrow: 1}}>
                    <Palettes/>
                </Box>
            </Box>
        </>
    )
}

export default Setting
