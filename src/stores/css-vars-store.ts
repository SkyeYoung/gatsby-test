import createCSSVarPalette from "../utils/createCSSVarPalette";
import {theme} from "../theme";
import {action, observable} from "mobx";
import persistStore from "../utils/persistStore";
import {clearPersistedStore} from "mobx-persist-store";

export interface PersistedStore {
    clearStoredDate(): Promise<void>
}

export interface VarsStore extends PersistedStore {
    light: typeof lightMap;
    dark: typeof darkMap;

    setLight(light: typeof lightMap): void;

    setDark(dark: typeof darkMap): void;

    setWithKey(label: ModeLabel, key: string, val: string): void;

    getWithKey(label: ModeLabel, key: string): string;
}

export type ModeLabel = Extract<keyof VarsStore, 'light' | 'dark'>

const {lightMap, darkMap} = createCSSVarPalette(theme.palette)

const varsStore = observable<VarsStore>({
    light: lightMap,
    dark: darkMap,
    setLight(light) {
        this.light = light
    },
    setDark(dark) {
        this.dark = dark
    },
    setWithKey(label, key, val) {
        this[label].set(key, val)
    },
    getWithKey(label, key) {
        const val = this[label].get(key)
        return typeof val === 'undefined'
            ? ''
            : val.includes(',')
                ? `rgba(${val})`
                : val
    },
    async clearStoredDate() {
        await clearPersistedStore(this);
    }
}, {
    light: observable.deep,
    dark: observable.deep,
    setLight: action.bound,
    setDark: action.bound,
    setWithKey: action.bound,
    getWithKey: action.bound,
    clearStoredDate: action.bound
})

persistStore(varsStore, {
    name: 'css-vars',
    properties: ['light', 'dark']
})

export {varsStore}
