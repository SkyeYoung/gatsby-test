import React from "react";
import {I18nextProvider, initReactI18next} from "react-i18next";
import i18next from "i18next";

const fromNavigator = () => {
    if (typeof window === 'undefined') return ''

    const nav = window.navigator
    const first = nav.languages
        ? nav.languages[0]
        : null

    return first
        || nav.language
        || nav.userLanguage
}

export const I18nInfoContext = React.createContext({})

const WrapPageElement = ({element, props}, lngOption) => {
    const {data} = props
    const STORE_KEY = lngOption.storeKey
    const i18n = i18next.createInstance()

    let detectedLng;
    if (typeof window !== 'undefined') {
        detectedLng = window.localStorage.getItem(STORE_KEY) || fromNavigator()
        window.localStorage.setItem(STORE_KEY, detectedLng)
    }

    i18n.use(initReactI18next)
        .init({
            debug: true,
            interpolation: {
                escapeValue: false
            },
            load: 'languageOnly',
            react: {
                useSuspense: false
            },
            lng: detectedLng,
            supportedLngs: Object.keys(lngOption.supportedLngs),
            ...lngOption.i18n
        })

    data.allLocale?.edges?.forEach(({node}) => {
        i18n.addResourceBundle(node.language, node.ns, JSON.parse(node.data))
    })

    const info = {
        lng: detectedLng,
        supportedLngs: lngOption.supportedLngs,
        ...lngOption.i18n
    }

    return (
        <I18nextProvider i18n={i18n}>
            <I18nInfoContext.Provider value={info}>
                {element}
            </I18nInfoContext.Provider>
        </I18nextProvider>
    )
}

export {WrapPageElement}

