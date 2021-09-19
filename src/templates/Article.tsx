import React, {useContext, useEffect} from "react"
import {Helmet} from "react-helmet"
import rehypeReact, {Options} from "rehype-react";
import {unified} from "unified";
import {DeepRequiredNonNull} from "../types/common";
import {graphql} from "gatsby";
import Main from "../components/Main";
import NavSidebar from "../components/NavSidebar";
import {infoStore} from "../stores/stores";
import Link from "../components/stand-in/Link";
import Table from "../components/stand-in/Table";
import Typography from "../components/stand-in/Typography";
import List from "../components/stand-in/List";
import {Root} from "hast";
import Box from "@material-ui/core/Box";
import Header from "../components/Header";
import Title from "../components/Title";
import {I18nPageInfoContext, I18nSiteInfoContext} from "../../plugins/gatsby-plugin-i18next/I18nWrapper";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";
import TocSidebar from "../components/TocSidebar";

export const query = graphql`
    query Post($id: String!) {
        markdownRemark(id: { eq: $id })  {
            id
            fileAbsolutePath
            htmlAst
            frontmatter {
                path
                title
            }
            toc: tableOfContents
            parent {
                ... on File {
                    name
                    changeTime
                    birthTime
                }
            }
        }

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
    }`

const processor = unified()
    .use(rehypeReact, {
        createElement: React.createElement,
        Fragment: React.Fragment,
        components: {
            a: Link,
            ...Table,
            ...Typography,
            ...List
        }
    } as Options)

const contentParser = (htmlAst: Root) => (processor.stringify(htmlAst) as never as JSX.Element)

const Article: React.FC<{ data: DeepRequiredNonNull<GatsbyTypes.PostQuery> }> = ({data}) => {
    const {
        markdownRemark: post,
        site
    } = data

    const siteTitle = site.siteMetadata.title
    const title = post.frontmatter.title || post.parent.name;
    const {supportedLngs} = useContext(I18nSiteInfoContext);
    const {lng, detectLng} = useContext(I18nPageInfoContext);
    const {t} = useTranslation(['header'])

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let toastId: number | string;
        const detectedLng = detectLng()
        if (typeof window !== "undefined" && detectedLng !== lng) {
            timeoutId = setTimeout(() => {
                toastId = toast(t('header:toolbar.lng.unsupportedLngPrompt', {
                    currentLng: supportedLngs[detectedLng],
                    fallbackLng: supportedLngs[lng]
                }), {
                    position: "bottom-left",
                })
            }, 300)
        }

        return () => {
            clearTimeout(timeoutId)
            toast.dismiss(toastId)
        }
    }, [])

    useEffect(() => {
        infoStore.setTitle(title)
    }, [title])

    return (
        <>
            <Helmet title={`${title ? title + ' - ' : ''}${siteTitle}`}/>

            <Box sx={{display: 'flex', flexFlow: 'column'}}>
                <Header/>
                <Box sx={{display: 'flex', flexGrow: 1}}>
                    <NavSidebar toc={post.toc}/>

                    <Main>
                        <Title>{title}</Title>
                        <article>
                            {contentParser(post.htmlAst)}
                        </article>
                    </Main>

                    <TocSidebar toc={post.toc}/>
                </Box>
            </Box>
        </>
    )
}

export default Article
