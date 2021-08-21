const React = require("react")
const cacheEmotion = require("./cacheEmotion").default
const {CacheProvider} = require("@emotion/react")

const cache = cacheEmotion();

exports.wrapRootElement = ({element}) => {
    return React.createElement(CacheProvider, {value: cache}, element)
}
