import React from "react"
import {Helmet} from "react-helmet"
import rehypeReact, {Options} from "rehype-react";
import {unified} from "unified";
import {Root} from "rehype-react/lib";
import {DeepRequiredNonNull} from "../types/common";
import {graphql} from "gatsby";
import Header from "../components/Header";
import {CssBaseline} from "@material-ui/core";
import Main from "../components/Main";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

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
                description
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

const Article: React.FC<{ data: DeepRequiredNonNull<GatsbyTypes.PostQuery> }> = ({data}) => {
    const {
        markdownRemark: post,
        site
    } = data

    const siteTitle = site.siteMetadata.title
    const title = post.frontmatter.title || post.parent.name;
    const ContentParser = contentParser();

    return (
        <>
            <Helmet>
                <title>{`${title ? title + '-' : ''}${siteTitle}`}</title>
                <meta name={'description'} content={site.siteMetadata.description}/>
            </Helmet>

            <CssBaseline/>

            <Box sx={{display: 'flex', flexFlow: 'column', height: '100vh'}}>
                <Header title={title}/>

                <Box sx={{display: 'flex', flexGrow: 1}}>
                    <Box sx={{
                        width: '250px',
                        borderRight: '1px solid #dfdfdf'
                    }}/>
                    <Main>
                        <Typography variant={'h1'}>{title}</Typography>
                        <ContentParser htmlAst={post.htmlAst}/>
                    </Main>
                </Box>
            </Box>
        </>
    )
}

export default Article
