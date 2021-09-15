import createCSSVarPalette, {mapToStr} from "../utils/createCSSVarPalette";
import {theme} from "../theme";
import {action, computed, observable} from "mobx";
import persistStore from "../utils/persistStore";
import {css, SerializedStyles} from "@emotion/react";
import {stopPersisting} from "mobx-persist-store";
import {Nullable} from "../types/common";

export interface PersistedStore {
    stopStore(): void
}

export interface VarsStore extends PersistedStore {
    light: typeof lightMap;
    dark: typeof darkMap;
    styleEl: Nullable<HTMLElement>;

    get computedCSS(): SerializedStyles;

    setLight(light: typeof lightMap): void;

    setDark(dark: typeof darkMap): void;

    setStyleEl(el: Nullable<HTMLElement>): void;

    setWithKey(label: ModeLabel, key: string, val: string): void;

    getWithKey(label: ModeLabel, key: string): string;
}

export type ModeLabel = Extract<keyof VarsStore, 'light' | 'dark'>


// init with created theme
// then will be overwrote by persisted store
const {lightMap, darkMap} = createCSSVarPalette(theme.palette)

const varsStore = observable<VarsStore>({
    light: lightMap,
    dark: darkMap,
    styleEl: null,

    get computedCSS(): SerializedStyles {
        return css`
          :root {
            color-scheme: light;
            ${mapToStr(this.light)}
          }

          :root[data-theme="dark"] {
            color-scheme: dark;
            ${mapToStr(this.dark)}
          }`
    },

    setLight(light) {
        this.light = light
    },
    setDark(dark) {
        this.dark = dark
    },
    setStyleEl(el) {
        this.styleEl = el
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
    stopStore() {
        stopPersisting(this)
    }
}, {
    light: observable.deep,
    dark: observable.deep,
    styleEl: observable,

    computedCSS: computed,

    setLight: action.bound,
    setDark: action.bound,
    setWithKey: action.bound,
    getWithKey: action.bound,
    stopStore: action.bound,
})

const VARS_STORE_ID = 'css-vars'

persistStore(varsStore, {
    name: VARS_STORE_ID,
    properties: ['light', 'dark']
})

export {varsStore, VARS_STORE_ID}
