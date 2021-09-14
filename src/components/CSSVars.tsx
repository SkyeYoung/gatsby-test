import {mapToStr} from "../utils/createCSSVarPalette";
import {css} from "@emotion/react";
import {GlobalStyles} from "@material-ui/core";
import React from "react";
import {observer} from "mobx-react-lite";
import {varsStore} from "../stores/css-vars-store";

const CSSVars = observer(() => {
    const style = css`
      :root {
        color-scheme: light;
        ${mapToStr(varsStore.light)}
      }

      :root[data-theme="dark"] {
        color-scheme: dark;
        ${mapToStr(varsStore.dark)}
      }
    `

    return <GlobalStyles styles={style}/>
})

export default CSSVars
