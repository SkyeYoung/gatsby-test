import createCache from "@emotion/cache";

const cacheEmotion = () => {
    return createCache({key: 'css'})
}

export default cacheEmotion;
