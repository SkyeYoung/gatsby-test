import Box from "@material-ui/core/Box";
import {GatsbyLinkProps, graphql, Link as GLink, useStaticQuery} from "gatsby";
import React, {useState} from "react";
import {DeepRequiredNonNull} from "../types/common";
import Stack from "@material-ui/core/Stack";
import {AppBar, Link, LinkProps, Slide} from "@material-ui/core";
import {useScroll} from "@use-gesture/react";
import {window} from "../utils/common";

type InSiteLink = {
    outSite?: false,
} & LinkProps & GatsbyLinkProps<any>

type OutSiteLink = {
    outSite: true
} & LinkProps

const HeaderLink: React.FC<InSiteLink | OutSiteLink> = (props) => {
    const {outSite = false, ...others} = props
    if (outSite) {
        others.target = '_blank'
        others.rel = 'noopener'
    }
    return <Link component={outSite ? 'a' : GLink}
                 variant={'h6'}
                 underline={'none'}
                 color={'white'}
                 {...others}/>
}

const Header: React.FC<{ title: string }> = (props) => {
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
    const [elevation, setElevation] = useState(0)
    const [appear, setAppear] = useState(true);

    useScroll(({xy: [, y], delta: [, dy]}) => {
        setTitle(y > 0 ? props.title : siteTitle)
        setElevation(y > 0 ? 3 : 0)
        setAppear(y <= 260 || dy < 0)
    }, {
        target: window
    })

    return (
        <Slide appear={false} direction={'down'} in={appear}>
            <AppBar
                elevation={elevation}
                sx={{
                    flexFlow: 'row',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    padding: '0 20px',
                    height: '60px'
                }}>
                <HeaderLink to={'/'}>{title}</HeaderLink>
                <Box sx={{flexGrow: 1}}/>
                <Stack direction={'row'}>
                    <HeaderLink
                        outSite={true}
                        href={'//github.com'}>
                        GitHub
                    </HeaderLink>
                </Stack>
            </AppBar>
        </Slide>
    )
}

const HeaderMemo = React.memo(Header)

export default HeaderMemo
