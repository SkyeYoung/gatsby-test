import {decomposeColor, hslToRgb, Palette, PaletteColor} from "@material-ui/core";
import {TypeAction, TypeText} from "@material-ui/core/styles/createPalette";
import {css} from "@emotion/react";

const paletteColorKeys: (keyof Palette)[] = [
    'primary',
    'secondary',
    'error',
    'info',
    'success',
    'warning'
]

const textKeys: (keyof TypeText)[] = ['primary', 'secondary', 'disabled']

const actionKeys: (keyof TypeAction)[] = [
    "active",
    "hover",
    "hoverOpacity",
    "selected",
    "selectedOpacity",
    "disabled",
    "disabledOpacity",
    "disabledBackground",
    "focus",
    "focusOpacity",
    "activatedOpacity"
]

const varName = (...names: string[]) => {
    const str = names.join('-')
    return str.startsWith('--') ? str : `--${str}`
}

const varColor = (str: string) => {
    return `rgba(var(${str}))`
}

const rgbaColor = (colorStr: string, fallbackAlpha: number = 1): string => {
    const color = decomposeColor(colorStr)

    if (isNaN(color.values[0])) {
        color.values.shift()
    }

    switch (color.type) {
        case "hsla":
        case "hsl":
            return `${decomposeColor(hslToRgb(colorStr)).values.join()},${fallbackAlpha}`
        default:
        case "rgb":
            return `${color.values.join()},${fallbackAlpha}`;
        case "rgba":
            return color.values.join();
    }
}


interface CSSVarPalette {
    lightMap: Map<string, string>;
    darkMap: Map<string, string>;
    palette: Palette;
}

const createCSSVarPalette = (palette: Palette): CSSVarPalette => {
    const lightMap = new Map<string, string>()
    const darkMap = new Map<string, string>()

    // primary, secondary, error...
    paletteColorKeys.forEach((k) => {
        const v = palette[k] as PaletteColor

        const name = varName(k)
        darkMap.set(name, rgbaColor(v.dark))
        lightMap.set(name, rgbaColor(v.main))
        v.main = v.light = v.dark = varColor(name)

        const textName = varName(name, 'contrastText')
        lightMap.set(textName, rgbaColor(v.contrastText))
        v.contrastText = varColor(textName)
    })

    // background
    {
        const bg = palette.background
        const name = varName('background')
        lightMap.set(name, rgbaColor(bg.default))
        darkMap.set(name, rgbaColor('#181818'))
        bg.default = varColor(name)

        const paperName = varName(name, 'paper')
        lightMap.set(paperName, rgbaColor(bg.paper))
        darkMap.set(paperName, rgbaColor(bg.paper))
        bg.paper = varColor(name)
    }

    // text
    {
        const name = varName('text')
        const text = palette.text
        textKeys.forEach((k) => {
            const keyName = varName(name, k);
            lightMap.set(keyName, rgbaColor(text[k]))
            text[k] = varColor(keyName)
        })
    }

    // action
    {
        const name = varName('action')
        const action = palette.action
        actionKeys.forEach((k) => {
            const v = action[k]
            const keyName = varName(name, k)
            if (typeof v === 'number') {
                lightMap.set(keyName, v.toString())
            } else {
                lightMap.set(keyName, rgbaColor(v))
            }
            // number | string
            action[k] = varColor(keyName) as never
        })
    }

    return {
        lightMap,
        darkMap,
        palette
    }
}

const mapToStr = (map: CSSVarPalette['lightMap']) => Array.from(map).map(([k, v]) => `${k}: ${v};`).join('\n')

const computeCSS = (light: CSSVarPalette['lightMap'], dark: CSSVarPalette['darkMap']) => {
    return css`
      :root {
        color-scheme: light;
        ${mapToStr(light)}
      }

      :root[data-theme="dark"] {
        color-scheme: dark;
        ${mapToStr(dark)}
      }
    `
}
export default createCSSVarPalette
export {mapToStr, computeCSS, varColor}
