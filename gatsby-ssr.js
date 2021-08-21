const React = require("react");
const {enableStaticRendering} = require("mobx-react-lite");
const Layout = require("./src/components/ArticleLayout").default

enableStaticRendering(true)

exports.wrapPageElement = ({element, props}) => {
    return React.createElement(Layout, props, element)
}
