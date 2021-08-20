const path = require("path")

const withPreSlash = (str = '') => {
    return str.startsWith('/') ? str : '/' + str
}

const CHECK_MD_EXP = /(.*)\.mdx?$/
const INDEX_NAME = 'index'

const getPath = (node) => {
    const relativePath = node.parent.relativePath.match(CHECK_MD_EXP)[1]
    const pathWithoutIndex = relativePath.endsWith(INDEX_NAME)
        ? relativePath.slice(0, -INDEX_NAME.length)
        : relativePath

    return withPreSlash(node.frontmatter.path || pathWithoutIndex)
}

exports.createPages = async ({actions, graphql, reporter}) => {
    const {createPage} = actions
    const articleTemplate = path.resolve('src/templates/Article.tsx')

    const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
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
