exports.onCreateWebpackConfig = ({
    resolve,
    actions,
    getConfig,
})=>{
    const config = getConfig()

    config.resolve.alias['@gatsbyjs/reach-router'] = 'node_modules/react-router-dom'

    config.module.rules = [
        ...config.module.rules.filter(
            rule =>  !/.*[t|j]sx?.*/.test(String(rule.test))
        ),
        {
            test:/\.[tj]sx?$/,
            use: {
                loader: 'swc-loader',
            },
            exclude: modulePath =>
                /node_modules/.test(modulePath),
        }
    ]

    actions.replaceWebpackConfig(config)
}
