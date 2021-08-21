import React, {useEffect} from "react"
import {Helmet} from "react-helmet"
import rehypeReact, {Options} from "rehype-react";
import {unified} from "unified";
import {Root} from "rehype-react/lib";
import {DeepRequiredNonNull} from "../types/common";
import {graphql} from "gatsby";
import Main from "../components/Main";
import Typography from "@material-ui/core/Typography";
import Sidebar from "../components/Sidebar";
import {infoStore} from "../stores";
import Link from "../components/article/Link";
import Table from "../components/article/Table";
import Typo from "../components/article/Typo";

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
    }`

type ContentParserType = (components?: Options['components']) => React.FC<{ htmlAst: Root }>
const contentParser: ContentParserType = (components) => {
    const processor = unified()
        .use(rehypeReact, {
            createElement: React.createElement,
            components
        } as Options)

    return ({htmlAst}) => (
        processor.stringify(htmlAst)
    )
}

const ContentParser = contentParser({
    a: Link,
    ...Table,
    ...Typo
} as Options['components']);

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
            <Helmet title={`${title ? title + '-' : ''}${siteTitle}`}/>

            <Sidebar toc={post.toc}/>

            <Main>
                <Typography variant={'h1'}>{title}</Typography>
                <ContentParser htmlAst={post.htmlAst}/>
            </Main>
        </>
    )
}

export default Article
