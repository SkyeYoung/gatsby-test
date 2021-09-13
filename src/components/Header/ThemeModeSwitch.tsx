import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import {ButtonGroup, NoSsr} from "@material-ui/core";
import styled from "@material-ui/core/styles/styled";
import {css} from "@emotion/react";
import {window} from "../../utils/common";

const THEME_MODE = {
    light: 'light',
    dark: 'dark',
    followSystem: ''
}

type ThemeModeKey = keyof typeof THEME_MODE

const SwitchBtn = styled(Button)(({theme}) => css`
  color: white;
  font-weight: ${theme.typography.fontWeightBold};
`)

const ThemeModeSwitch = () => {
    const [mode, setMode] = useState<string | undefined>(window.__theme || THEME_MODE.light);

    const handleClick = (mode: string) => {
        return () => {
            setMode(mode)
            window.__setPreferredTheme(mode)
        }
    }

    return (
        <NoSsr>
            <ButtonGroup>
                {Object.keys(THEME_MODE).map((k) => {
                    const v = THEME_MODE[k as ThemeModeKey]
                    return (
                        <SwitchBtn
                            key={k}
                            onClick={handleClick(v)}
                            color={mode === v ? 'success' : 'info'}
                        >
                            {k}
                        </SwitchBtn>
                    )
                })}
            </ButtonGroup>
        </NoSsr>
    )
}

export {THEME_MODE}

export default ThemeModeSwitch


