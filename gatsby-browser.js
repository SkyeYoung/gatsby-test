const React = require("react");
const Layout = require("./src/components/ArticleLayout").default

exports.wrapPageElement = ({element, props}) => {
    return React.createElement(Layout, props, element)
}

