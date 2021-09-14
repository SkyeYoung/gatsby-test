import createCSSVarPalette, {mapToStr} from "../utils/createCSSVarPalette";
import theme from "../theme/theme";
import {css} from "@emotion/react";
import {GlobalStyles} from "@material-ui/core";
import React from "react";

const {lightMap, darkMap} = createCSSVarPalette(theme.palette)

const style = css`
  :root {
    color-scheme: light;
    ${mapToStr(lightMap)}
  }

  :root[data-theme="dark"] {
    color-scheme: dark;
    ${mapToStr(darkMap)}
  }
`

const CSSVars = () => {
    return <GlobalStyles styles={style}/>
}

export default CSSVars
