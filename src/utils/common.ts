import {Nothing} from "nothing-mock";

const win = typeof window === 'undefined' ? Nothing : window


export {win as window}
