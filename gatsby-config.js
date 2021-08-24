const path = require("path");

module.exports = {
    flags: {
        PARALLEL_SOURCING: true,
        DEV_WEBPACK_CACHE: true,
        DEV_SSR: true,
        LMDB_STORE: true,
        PARALLEL_QUERY_RUNNING: true
    },
    siteMetadata: {
        siteUrl: "https://www.yourdomain.tld",
        title: "Gatsby",
    },
    plugins: [
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: 'docs',
                path: `${__dirname}/docs`
            },
            __key: "pages",
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: 'locales',
                path: `${__dirname}/locales`
            },
        },
        {
            resolve: "gatsby-plugin-i18next",
            options: {
                fallbackLng: 'en',
                supportedLngs: ['en', 'zh'],
                ns: ['header'],
            }
        },
        {
            resolve: "gatsby-plugin-react-helmet"
        },
        {
            resolve: "gatsby-transformer-remark"
        },
        {
            resolve: "gatsby-plugin-mui-emotion"
        },
        {
            resolve: 'gatsby-plugin-typegen',
            options: {
                outputPath: `${__dirname}/src/__generated__/gatsby-types.d.ts`,
                emitSchema: {
                    [`${__dirname}/src/__generated__/gatsby-schema.graphql`]: true,
                    [`${__dirname}/src/__generated__/gatsby-introspection.json`]: true,
                },
                emitPluginDocuments: {
                    [`${__dirname}/src/__generated__/gatsby-plugin-documents.graphql`]: true,
                },
            },
        },
    ],
}
;
