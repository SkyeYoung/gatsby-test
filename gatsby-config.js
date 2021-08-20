const path = require("path");

module.exports = {
    flags: {
        PARALLEL_SOURCING: true,
        DEV_WEBPACK_CACHE: true
    },
    siteMetadata: {
        siteUrl: "https://www.yourdomain.tld",
        title: "Gatsby",
    },
    plugins: [
        {
            resolve: "gatsby-plugin-react-helmet"
        },
        {
            resolve: "gatsby-transformer-remark"
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: './docs',
                path: path.resolve('./docs'),
            },
            __key: "pages",
        },
        {
            resolve: 'gatsby-plugin-typegen',
            options: {
                outputPath: path.resolve(__dirname, 'src/__generated__/gatsby-types.d.ts'),
                emitSchema: {
                    [path.resolve(__dirname, 'src/__generated__/gatsby-schema.graphql')]: true,
                    [path.resolve(__dirname, 'src/__generated__/gatsby-introspection.json')]: true,
                },
                emitPluginDocuments: {
                    [path.resolve(__dirname, 'src/__generated__/gatsby-plugin-documents.graphql')]: true,
                },
            },
        },
    ],
};
