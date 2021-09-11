import {Nothing} from "nothing-mock";

const win = typeof window === 'undefined' ? Nothing : window

const getWindowSize = () => {
    return {
        width: win.innerWidth || document.documentElement.clientWidth,
        height: win.innerHeight || document.documentElement.clientHeight,
    }
}

export {win as window, getWindowSize}
