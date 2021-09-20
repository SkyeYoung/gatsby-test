import React, {useState} from "react";
import {window} from "../../utils/common";
import Typography from "../stand-in/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup"

const THEME_MODE = {
    light: 'light',
    dark: 'dark',
    followSystem: ''
}

type ThemeModeKey = keyof typeof THEME_MODE

const ThemeModeSwitch = () => {
    const [mode, setMode] = useState<string | undefined>(window.__theme || THEME_MODE.light);

    const handleClick = (mode: string) => {
        return () => {
            setMode(mode)
            window.__setPreferredTheme(mode)
        }
    }

    return (
        <>
            <Typography.h1>Mode</Typography.h1>
            <ButtonGroup variant={'outlined'} aria-label="outlined primary button group">
                {Object.keys(THEME_MODE).map((k) => {
                    const v = THEME_MODE[k as ThemeModeKey]
                    return (
                        <Button
                            key={k}
                            onClick={handleClick(v)}
                            color={mode === v ? 'success' : 'inherit'}
                        >
                            {k}
                        </Button>
                    )
                })}
            </ButtonGroup>
        </>
    )
}

export {THEME_MODE}

export default ThemeModeSwitch


