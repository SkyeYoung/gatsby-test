import React, {useContext} from "react";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {I18nContext, I18nextProvider, initReactI18next} from "react-i18next";

export const I18nInfoContext = React.createContext({})

const Provider = ({element}, language) => {
    if (!language) {
        throw new Error('no language options')
    }

    const i18n = i18next.createInstance()

    i18n.use(LanguageDetector)
        .use(initReactI18next)
        .init({
            // initImmediate: false,
            debug: true,
            interpolation: {
                escapeValue: false
            },
            load: 'languageOnly',
            react: {
                useSuspense: false
            },
            ...language
        })

    return (
        <I18nextProvider i18n={i18n}>
            <I18nInfoContext.Provider value={language}>
                {element}
            </I18nInfoContext.Provider>
        </I18nextProvider>
    )
}

const Layout = ({element, props}) => {
    const {data} = props
    const {i18n} = useContext(I18nContext)

    // useEffect(() => {
    data.allLocale?.edges?.forEach(({node}) => {
        if (!i18n.hasResourceBundle(node.language, node.ns)) {
            i18n.addResourceBundle(node.language, node.ns, JSON.parse(node.data))
        }
    })
    // }, [i18n, data?.allLocale?.edges])

    return element
}

const LayoutBuilder = ({element, props}) => {
    return <Layout element={element} props={props}/>
}


export {Provider, LayoutBuilder as Layout}

