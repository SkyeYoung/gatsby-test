const React = require("react")
const cacheEmotion = require("./cacheEmotion").default
const createEmotionServer = require("@emotion/server/create-instance").default
const {renderToString} = require("react-dom/server")
const {CacheProvider} = require("@emotion/react")

exports.replaceRenderer = ({bodyComponent, setHeadComponents, replaceBodyHTMLString}) => {
    const cache = cacheEmotion();
    const {extractCriticalToChunks} = createEmotionServer(cache)

    const emotionStyles = extractCriticalToChunks(
        renderToString(React.createElement(CacheProvider, {value: cache}, bodyComponent))
    )

    setHeadComponents(
        emotionStyles.styles
            .filter((style) => !!style.css.trim())
            .map((style) => (
                React.createElement('style', {
                    'data-emotion': `${style.key}-${style.ids.join('_')}`,
                    key: style.key,
                    dangerouslySetInnerHTML: {
                        __html: style.css
                    }
                })
            ))
    )

    replaceBodyHTMLString(emotionStyles.html)
}
