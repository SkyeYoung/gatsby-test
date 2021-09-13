import {css, Global} from "@emotion/react";
import React from "react";
import createCSSVarPalette, {mapToStr} from "../utils/createCSSVarPalette";
import theme from "../theme/theme";


const {lightMap, darkMap} = createCSSVarPalette(theme.palette)

const style = css`
  :root {
    color-scheme: light;

    ${mapToStr(lightMap)}
    &[data-theme="dark"] {
      color-scheme: dark;
      ${mapToStr(darkMap)}
    }
  }
`
const Palette = () => <Global styles={style}/>


export default Palette
