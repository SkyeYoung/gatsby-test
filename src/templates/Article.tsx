import React, {useEffect} from "react"
import {Helmet} from "react-helmet"
import rehypeReact, {Options} from "rehype-react";
import {unified} from "unified";
import {DeepRequiredNonNull} from "../types/common";
import {graphql} from "gatsby";
import Main from "../components/Main";
import Sidebar from "../components/Sidebar";
import {infoStore} from "../stores";
import Link from "../components/article/Link";
import Table from "../components/article/Table";
import Typography from "../components/article/Typography";
import List from "../components/article/List";
import styled from "@material-ui/core/styles/styled";
import {Root} from "hast";
import Box from "@material-ui/core/Box";
import Header from "../components/Header";

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

const Title = styled(Typography.h1)`
  margin-top: 2.5rem;
`

const Article: React.FC<{ data: DeepRequiredNonNull<GatsbyTypes.PostQuery> }> = ({data}) => {
    const {
        markdownRemark: post,
        site
    } = data

    const siteTitle = site.siteMetadata.title
    const title = post.frontmatter.title || post.parent.name;

    useEffect(() => {
        infoStore.title = title
    }, [title])

    return (
        <>
            <Helmet title={`${title ? title + ' - ' : ''}${siteTitle}`}/>

            <Box sx={{display: 'flex', flexFlow: 'column'}}>
                <Header/>
                <Box sx={{display: 'flex', flexGrow: 1}}>
                    <Sidebar toc={post.toc}/>

                    <Main>
                        <Title>{title}</Title>
                        <article>
                            {contentParser(post.htmlAst)}
                        </article>
                    </Main>
                </Box>
            </Box>
        </>
    )
}

export default Article
