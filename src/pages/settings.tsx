import React, {useMemo} from "react";
import {DeepRequiredNonNull} from "../types/common";
import {Helmet} from "react-helmet";
import Box from "@mui/material/Box";
import {graphql} from "gatsby";
import Palettes from "../components/setting/Palettes";
import Header from "../components/Header";
import {sidebarStore} from "../stores/stores";
import ThemeModeSwitch from "../components/setting/ThemeModeSwitch";
import useTheme from "@mui/material/styles/useTheme";

export const query = graphql`
    query SiteBasicInfo {
        site {
            siteMetadata {
                title
            }
        }

        allLocale {
            edges {
                node {
                    ns
                    data
                    language
                }
            }
        }
    }
`

const Wrapper: React.FC = (props) => {
    const theme = useTheme()
    const paddingInline = useMemo(() => sidebarStore.width + 'px', [sidebarStore.width]);

    return <Box sx={{
        [theme.breakpoints.up('lg')]: {
            paddingInline
        }
    }}>
        {props.children}
    </Box>
}


const Setting: React.FC<{ data: DeepRequiredNonNull<GatsbyTypes.SiteBasicInfoQuery> }> = ({data}) => {
    const {site} = data
    const siteTitle = site.siteMetadata.title

    return (
        <>
            <Helmet title={`settings - ${siteTitle}`}/>

            <Box sx={{display: 'flex', flexFlow: 'column'}}>
                <Header/>
                <Wrapper>
                    <ThemeModeSwitch/>
                    <Palettes/>
                </Wrapper>
            </Box>
        </>
    )
}

export default Setting
