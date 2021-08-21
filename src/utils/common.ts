import {Nothing} from "nothing-mock";

const win = typeof window === 'undefined' ? Nothing : window

const INDEX_NAME = 'index'
const removeIndex = (path: string) => {
    let p = path
    if (p.endsWith(INDEX_NAME)) {
        p = p.slice(0, -INDEX_NAME.length)
    }
    return p
}

export {win as window, removeIndex}
