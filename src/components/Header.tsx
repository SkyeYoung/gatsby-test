import Box from "@material-ui/core/Box";
import {GatsbyLinkProps, graphql, Link as GLink, useStaticQuery} from "gatsby";
import React, {useState} from "react";
import {DeepRequiredNonNull} from "../types/common";
import Stack from "@material-ui/core/Stack";
import AppBar from "@material-ui/core/AppBar";
import Link, {LinkProps} from "@material-ui/core/Link";
import Slide from "@material-ui/core/Slide"
import {useScroll} from "@use-gesture/react";
import {window} from "../utils/common";
import {observer} from "mobx-react-lite";
import {headerStore, infoStore} from "../stores";

type InSiteLink = {
    outSite?: false,
} & GatsbyLinkProps<any>

type OutSiteLink = {
    outSite: true
}

type HeaderLinkProps<C extends React.Component = any> = {
    component?: C,
    title: string
} & (InSiteLink | OutSiteLink) & Omit<LinkProps, 'title'>

const HeaderLink: React.FC<HeaderLinkProps> = (props) => {
    const {outSite = false, ...others} = props

    if (outSite) {
        others.target = '_blank'
        others.rel = 'noopener'
    } else {
        others.component = GLink
    }

    return (
        <Link
            variant={'h6'}
            underline={'none'}
            color={'white'}
            sx={{
                margin: 'unset'
            }}
            {...others}/>
    )
}

const Header: React.FC = observer(() => {
    const data = useStaticQuery<GatsbyTypes.SiteInfoQuery>(graphql`
        query SiteInfo {
            site {
                siteMetadata {
                    title
                    description
                }
            }
        }
    `) as DeepRequiredNonNull<GatsbyTypes.SiteInfoQuery>

    const siteTitle = data.site.siteMetadata.title
    const [title, setTitle] = useState(siteTitle)
    const [elevation, setElevation] = useState(0);

    useScroll(({xy: [, y], delta: [, dy]}) => {
        setTitle(y > 0 ? infoStore.title : siteTitle)
        setElevation(y > 0 ? 2 : 0)
        headerStore.appear = y <= 260 || dy < 0
    }, {
        target: window
    })

    return (
        <Slide appear={false} direction={'down'} in={headerStore.appear}>
            <AppBar
                elevation={elevation}
                sx={{
                    flexFlow: 'row',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    padding: '0 20px',
                    height: 60,
                }}>
                <HeaderLink to={'/'} title={'Link to homepage'}>{title}</HeaderLink>
                <Box sx={{flexGrow: 1}}/>
                <Stack direction={'row'}>
                    <HeaderLink
                        outSite={true}
                        title={'Link to GitHub'}
                        href={'//github.com'}>
                        GitHub
                    </HeaderLink>
                </Stack>
            </AppBar>
        </Slide>
    )
})

export default Header
