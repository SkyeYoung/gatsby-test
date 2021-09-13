import {RenderBodyArgs} from "gatsby";
import React from "react";
import themeMode from "../static/theme-mode";

const themeModeScript = `(${themeMode})()`

const headComponents: React.ReactNode[] = [
    <meta key="color-scheme" name="color-scheme" content="light dark"/>,
    <script key="theme-switch" dangerouslySetInnerHTML={{
        __html: themeModeScript
    }}/>
]

const OnRenderBody = (props: RenderBodyArgs) => {
    const {setHeadComponents} = props

    setHeadComponents(headComponents)
}

export default OnRenderBody
