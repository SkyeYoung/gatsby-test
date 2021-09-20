import Box from "@mui/material/Box";
import React, {useContext, useRef, useState} from "react";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";
import {I18nPageInfoContext, I18nSiteInfoContext} from "../../../plugins/gatsby-plugin-i18next/I18nWrapper";
import MenuItem from "@mui/material/MenuItem";
import {toast} from "react-toastify";
import MyMenu from "../MyMenu";
import {css} from "@emotion/react";
import styled from "@mui/material/styles/styled";
import {Nullable} from "../../types/common";
import NoSsr from "@mui/material/NoSsr";

const SwitchBtn = styled(Button)(({theme}) => css`
  color: white;
  font-weight: ${theme.typography.fontWeightBold};
`)

const LngSwitch: React.FC = () => {
    const {t} = useTranslation(['header'])
    const {supportedLngs} = useContext(I18nSiteInfoContext);
    const {lng: pageLng, changeLng, detectLng} = useContext(I18nPageInfoContext);

    const anchor = useRef<Nullable<HTMLButtonElement>>(null);
    const [detectedLang, setDetectedLang] = useState(detectLng());
    const [open, setOpen] = useState(false);
    const id = React.useMemo(() => open ? 'menu-popper' : undefined, [open])
    const expended = React.useMemo(() => open ? 'true' : undefined, [open])

    const switchBtnId = 'language-switch'

    const toggleOpen = () => {
        setOpen(!open)
    }
    const onClose = () => {
        setOpen(false)
    }

    const chgLng = (lang: string) => {
        return async () => {
            await changeLng(lang).then(({pageSupport}) => {
                setDetectedLang(lang)
                if (!pageSupport) {
                    toast(t('header:toolbar.lng.unsupportedLngPrompt', {
                        currentLng: supportedLngs[lang],
                        fallbackLng: supportedLngs[pageLng]
                    }), {
                        position: "bottom-left"
                    })
                }
                onClose()
            })
        }
    }

    return (
        <NoSsr>
            <Box>
                <SwitchBtn
                    ref={anchor}
                    id={switchBtnId}
                    aria-haspopup="true"
                    aria-describedby={id}
                    aria-controls={id}
                    aria-expanded={expended}
                    title={t('header:toolbar.lng.title')}
                    onClick={toggleOpen}
                >
                    {t('header:toolbar.lng.name')}
                </SwitchBtn>
                <MyMenu
                    id={id}
                    anchorEl={anchor.current}
                    open={open}
                    onClose={onClose}
                    MenuListProps={{
                        'aria-labelledby': switchBtnId,
                    }}
                >
                    {Object.entries(supportedLngs).map(([lang, name]) =>
                        <MenuItem
                            key={lang}
                            onClick={chgLng(lang)}
                            disabled={lang === detectedLang}
                        >
                            {name}
                        </MenuItem>
                    )}
                </MyMenu>
            </Box>
        </NoSsr>
    )
}

export default LngSwitch




