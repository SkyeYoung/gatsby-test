import {RenderBodyArgs} from "gatsby";
import React from "react";
import themeMode from "../../static/theme-mode";
import {theme} from "../../theme";
import createCSSVarPalette, {computeCSS} from "../../utils/createCSSVarPalette";
import {VARS_STORE_ID} from "../../stores/css-vars-store";
import cssVars from "../../static/css-vars";

// init with created theme
// then will be overwrote by persisted store
const {lightMap, darkMap} = createCSSVarPalette(theme.palette)

const defaultCSSVars = computeCSS(lightMap, darkMap).styles.replace(/\s/g, '')

const headComponents: React.ReactNode[] = [
    <meta key="color-scheme" name="color-scheme" content="light dark"/>,
    <script key="theme-switch" dangerouslySetInnerHTML={{
        __html: `(${themeMode})()`
    }}/>,
    <style key={VARS_STORE_ID} id={VARS_STORE_ID} dangerouslySetInnerHTML={{
        __html: defaultCSSVars
    }}/>,
    <script key={VARS_STORE_ID + '-restore'} dangerouslySetInnerHTML={{
        __html: `(${cssVars})()`
    }}/>
]

const OnRenderBody = (props: RenderBodyArgs) => {
    const {setHeadComponents} = props

    setHeadComponents(headComponents)
}

export default OnRenderBody
