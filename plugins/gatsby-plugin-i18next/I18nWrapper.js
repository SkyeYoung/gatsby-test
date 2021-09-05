import React from "react";
import {getI18n, I18nextProvider, initReactI18next} from "react-i18next";
import i18next from "i18next";
import {globalHistory} from "@reach/router"
import {navigate} from "gatsby";

const fromLocal = (key) => {
    return window.localStorage.getItem(key)
}

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

const I18nSiteInfoContext = React.createContext({})

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
            <I18nSiteInfoContext.Provider value={lngOption}>
                {element}
            </I18nSiteInfoContext.Provider>
        </I18nextProvider>
    )
}


let localesLoaded = false

const I18nPageInfoContext = React.createContext({})

const WrapPageElement = ({element, props}, lngOption) => {
    const {data, pageContext} = props
    const i18n = getI18n()

    if (!pageContext?.i18n) return element

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
        detectedLng = fromLocal(STORE_KEY) || fromNavigator()
        detectedLng = detectedLng.split('-')[0]

        // change current site language
        changeSiteLng(i18n, STORE_KEY, supportedLngs, detectedLng)

        // change current page language
        if (detectedLng !== i18nContext.lng) {
            changePageLng(i18nContext, detectedLng)
        }
    }

    const util = {
        lng: i18nContext.lng,
        lngs: i18nContext.lngs,
        detectLng: () => fromLocal(STORE_KEY),
        changeLng: changeLng.bind(null, i18n, pageContext.i18n, STORE_KEY, supportedLngs),
        parseUrl: parseUrl.bind(null, pageContext.i18n.lngs, pageContext.i18n.fallbackLng)
    }

    return (
        <I18nPageInfoContext.Provider value={util}>
            {element}
        </I18nPageInfoContext.Provider>
    )
}

export {WrapRootElement, WrapPageElement, I18nSiteInfoContext, I18nPageInfoContext, changeLng}

