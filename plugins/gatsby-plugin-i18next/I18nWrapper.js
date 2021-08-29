import React from "react";
import {getI18n, I18nextProvider, initReactI18next} from "react-i18next";
import i18next from "i18next";
import {globalHistory} from "@reach/router"
import {navigate} from "gatsby";

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

const withSlash = (url) => {
    return url.endsWith('/') ? url : (url + '/');
}

const parseUrl = (lngs, fallbackLng) => {
    const location = globalHistory.location
    const url = withSlash(location.href.substring(location.origin.length))
    const secSlashPos = url.indexOf('/', 1)
    const lngStr = url.substring(1, secSlashPos)
    const lng = lngs.find(v => v === lngStr) || fallbackLng

    return {
        lng,
        url: lng === fallbackLng ? url : url.substring(secSlashPos)
    }
}

const changePageLng = async (i18nContext, lng) => {
    if (i18nContext.lngs.includes(lng)) {
        const {url} = parseUrl(i18nContext.lngs, i18nContext.fallbackLng)
        const newUrl = lng === i18nContext.fallbackLng ? url : `/${lng}${url}`
        await navigate(newUrl)
    }
}

const changeSiteLng = async (i18n, storeKey, supportedLngs, lng) => {
    if (supportedLngs.includes(lng)) {
        window.localStorage.setItem(storeKey, lng)
        await i18n.changeLanguage(lng)
    }
}

const changeLng = async (i18n, i18nContext, storeKey, supportedLngs, lng) => {
    await changeSiteLng(i18n, storeKey, supportedLngs, lng)
    await changePageLng(i18nContext, lng)
    return {
        siteSupport: supportedLngs.includes(lng),
        pageSupport: i18nContext.lngs.includes(lng)
    }
}

const I18nInfoContext = React.createContext({})

const WrapRootElement = ({element}, lngOption) => {
    const supportedLngs = Object.keys(lngOption.supportedLngs)
    const i18n = i18next.createInstance()

    i18n.use(initReactI18next)
        .init({
            debug: process.env.NODE_ENV === 'development',
            interpolation: {
                escapeValue: false
            },
            load: 'languageOnly',
            react: {
                useSuspense: false
            },
            supportedLngs,
            ...lngOption.i18n
        })


    return (
        <I18nextProvider i18n={i18n}>
            <I18nInfoContext.Provider value={lngOption}>
                {element}
            </I18nInfoContext.Provider>
        </I18nextProvider>
    )
}


let localesLoaded = false

const I18nUtilContext = React.createContext({})

const WrapPageElement = ({element, props}, lngOption) => {
    const {data, pageContext} = props
    const i18n = getI18n()

    if (!pageContext) return element

    // load locales
    if (!localesLoaded) {
        data?.allLocale?.edges?.forEach(({node}) => {
            if (!i18n.hasResourceBundle(node.language, node.ns)) {
                i18n.addResourceBundle(node.language, node.ns, JSON.parse(node.data))
            }
        })
        localesLoaded = true
    }

    const STORE_KEY = lngOption.storeKey
    const {i18n: i18nContext} = pageContext
    const supportedLngs = Object.keys(lngOption.supportedLngs)

    //
    let detectedLng;
    if (typeof window !== 'undefined' && typeof i18nContext !== 'undefined') {
        detectedLng = window.localStorage.getItem(STORE_KEY) || fromNavigator()
        detectedLng = detectedLng.split('-')[0]
        window.localStorage.setItem(STORE_KEY, detectedLng)

        // change current page
        if (detectedLng !== i18nContext.lng) {
            changePageLng(i18nContext, detectedLng)
        }
    }

    const util = {
        detectedLng,
        changeLng: changeLng.bind(null, i18n, pageContext.i18n, STORE_KEY, supportedLngs)
    }

    return (
        <I18nUtilContext.Provider value={util}>
            {element}
        </I18nUtilContext.Provider>
    )
}

export {WrapRootElement, WrapPageElement, I18nInfoContext, I18nUtilContext, changeLng}

