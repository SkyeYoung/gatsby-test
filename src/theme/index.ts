import {createTheme} from "@material-ui/core";
import {grey} from "@material-ui/core/colors";
import {CSSProperties} from "react";

const commonTypo: CSSProperties = {
    fontWeight: 'bold',
    marginBlockEnd: '1rem',
    marginBlockStart: '1.5rem',
    color: grey["800"]
}

const theme = createTheme({
    typography: {
        h1: {
            fontSize: '2.5rem',
            paddingBottom: '.3rem',
            borderBlockEnd: `1px solid ${grey["300"]}`,
            ...commonTypo
        },
        h2: {
            fontSize: '2rem',
            paddingBottom: '.3rem',
            borderBlockEnd: `1px solid ${grey["300"]}`,
            ...commonTypo
        },
        h3: {
            fontSize: '1.75rem',
            ...commonTypo
        },
        h4: {
            fontSize: '1.5rem',
            ...commonTypo
        },
        h5: {
            fontSize: '1.25rem',
            ...commonTypo
        },
        h6: {
            fontSize: '1rem',
            ...commonTypo
        }
    }
})

export {theme}
