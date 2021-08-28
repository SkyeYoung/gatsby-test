const path = require("path")

const withPreSlash = (str = '') => {
    return str.startsWith('/') ? str : '/' + str
}

const INDEX_NAME = 'index'
const removeIndex = (path) => {
    let p = path
    if (p.endsWith(INDEX_NAME)) {
        p = p.slice(0, -INDEX_NAME.length)
    }
    return p
}

const CHECK_MD_EXP = /(.*)\.mdx?$/
const getPath = (node) => {
    let relativePath = node.parent.relativePath.match(CHECK_MD_EXP)[1]
    relativePath = removeIndex(relativePath)

    return withPreSlash(node.frontmatter.path || relativePath)
}

exports.createPages = async ({actions, graphql, reporter}) => {
    const {createPage} = actions
    const articleTemplate = path.resolve('src/templates/Article.tsx')

    const result = await graphql(`
        {
            allMarkdownRemark {
                edges {
                    node {
                        id
                        frontmatter {
                            path
                        }
                        parent {
                            ... on File {
                                relativePath
                            }
                        }
                    }
                }
            }
        }
    `)

    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`)
        return
    }

    result.data.allMarkdownRemark.edges.forEach(({node}) => {
        createPage({
            path: getPath(node),
            component: articleTemplate,
            context: {
                id: node.id
            }
        })
    })
}
