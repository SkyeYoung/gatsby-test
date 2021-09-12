import React, {useEffect} from "react";
import {I18nextProvider, initReactI18next} from "react-i18next";
import i18next from "i18next";
import {globalHistory} from "@reach/router"
import {navigate} from "gatsby";

const fromLocal = (key) => {
    if (typeof window === 'undefined') return ''
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
    if (typeof window === 'undefined') return
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

const i18n = i18next.createInstance()

const WrapRootElement = ({element}, lngOption) => {
    const supportedLngs = Object.keys(lngOption.supportedLngs)

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
        <I18nSiteInfoContext.Provider value={lngOption}>
            <I18nextProvider i18n={i18n}>
                {element}
            </I18nextProvider>
        </I18nSiteInfoContext.Provider>
    )
}


const I18nPageInfoContext = React.createContext({})

const WithI18nLayout = (props) => {
    const {children, pageI18nInfo, storeKey, supportedLngs} = props

    useEffect(() => {
        let detectedLng;
        if (typeof window !== 'undefined' && typeof pageI18nInfo !== 'undefined') {
            detectedLng = fromLocal(storeKey) || fromNavigator()
            detectedLng = detectedLng.split('-')[0]

            // change current site language
            changeSiteLng(i18n, storeKey, supportedLngs, detectedLng)

            // change current page language
            if (detectedLng !== pageI18nInfo.lng) {
                changePageLng(pageI18nInfo, detectedLng)
            }

        }
    }, [changeSiteLng, changePageLng, fromNavigator, fromLocal])

    const util = {
        lng: pageI18nInfo.lng,
        lngs: pageI18nInfo.lngs,
        detectLng: fromLocal.bind(null, storeKey),
        changeLng: changeLng.bind(null, i18n, pageI18nInfo, storeKey, supportedLngs),
        parseUrl: parseUrl.bind(null, pageI18nInfo.lngs, pageI18nInfo.fallbackLng)
    }

    return (
        <I18nPageInfoContext.Provider value={util}>
            {children}
        </I18nPageInfoContext.Provider>
    )
}

let localesLoaded = false
const WrapPageElement = ({element, props}, lngOption) => {
    const {data, pageContext} = props

    if (pageContext?.i18n) {
        // load locales
        if (!localesLoaded) {
            data?.allLocale?.edges?.forEach(({node}) => {
                if (!i18n.hasResourceBundle(node.language, node.ns)) {
                    i18n.addResourceBundle(node.language, node.ns, JSON.parse(node.data))
                }
            })

            i18n.isInitialized = true;
            localesLoaded = true
        }

        const {i18n: pageI18nInfo} = pageContext || {}
        const supportedLngs = Object.keys(lngOption.supportedLngs)

        return (
            <WithI18nLayout
                pageI18nInfo={pageI18nInfo}
                supportedLngs={supportedLngs}
                storeKey={lngOption.storeKey}>
                {element}
            </WithI18nLayout>
        )
    } else {
        return element
    }
}

export {WrapRootElement, WrapPageElement, I18nSiteInfoContext, I18nPageInfoContext, changeLng}

