import React from "react";
import MLink, {LinkProps as MLinkProps} from "@material-ui/core/Link";
import {GatsbyLinkProps, Link as GLink} from "gatsby";

type Find = (func: ((exp: string) => boolean), ...exps: string[]) => string | undefined
const find: Find = (func, ...exps) => exps.find((exp) => func(exp))

const INDEX_NAME = 'index'
const removeIndex = (path: string) => {
    let p = path
    if (p.endsWith(INDEX_NAME)) {
        p = p.slice(0, -INDEX_NAME.length)
    }
    return p
}

type StyledLinkProps<C extends React.ElementType = typeof GLink> = MLinkProps<C, { component?: C, to?: string }>
const StyledLink: React.FC<StyledLinkProps> = (props) =>
    <MLink underline={'none'} {...props}/>

type LinkProps = Omit<MLinkProps, 'href'> & Omit<GatsbyLinkProps<any>, 'to'> & { href: string }
const Link: React.FC<LinkProps> = (props) => {
    let {href, ...others} = props
    const hasPrefix = !!find(href.startsWith.bind(href), 'http', '//')

    // outside the website
    if (hasPrefix) {
        return <StyledLink href={href} target={'_blank'} rel={'noopener'} {...others}/>
    } else {
        // remove markdown extension
        const MdExt = find(href.endsWith.bind(href), '.md', '.mdx', '.markdown', 'mdtext')
        if (MdExt) href = href.slice(0, -MdExt.length)

        // add prefix slash
        if (!find(href.startsWith.bind(href), '.', '/')) {
            href = '/' + href
        }

        // remove index
        href = removeIndex(href)

        return <StyledLink component={GLink} to={href} {...others}/>
    }
}

export default Link
