import Box from "@material-ui/core/Box";
import React, {useContext, useRef, useState} from "react";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import {I18nPageInfoContext, I18nSiteInfoContext} from "../../../plugins/gatsby-plugin-i18next/I18nWrapper";
import MenuItem from "@material-ui/core/MenuItem";
import {toast} from "react-toastify";
import MyMenu from "../MyMenu";
import {css} from "@emotion/react";
import styled from "@material-ui/core/styles/styled";
import {Nullable} from "../../types/common";

const SwitchBtn = styled(Button)(({theme}) => css`
  color: white;
  font-weight: ${theme.typography.fontWeightBold};
`)

const LngSwitch: React.FC = () => {
    const {t} = useTranslation(['header'])
    const {supportedLngs} = useContext(I18nSiteInfoContext);
    const {lng: pageLng, changeLng, detectLng} = useContext(I18nPageInfoContext);

    const anchor = useRef<Nullable<HTMLButtonElement>>(null);
    const [open, setOpen] = useState(false);
    const id = open ? 'menu-popper' : undefined;
    const detectedLng = typeof detectLng === 'function' ? detectLng() : ''

    const toggleOpen = () => {
        setOpen(!open)
    }
    const onClose = () => {
        setOpen(false)
    }

    const chgLng = (lng: string) => {
        return async () => {
            await changeLng(lng).then(({pageSupport}) => {
                if (!pageSupport) {
                    toast(t('header:toolbar.lng.unsupportedLngPrompt', {
                        currentLng: supportedLngs[lng],
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
        <Box>
            <SwitchBtn
                ref={anchor}
                id="language-switch"
                aria-describedby={id}
                aria-controls={id}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
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
                    'aria-labelledby': 'language-switch',
                }}
            >
                {Object.entries(supportedLngs)?.map(([lng, name]) =>
                    <MenuItem
                        key={lng}
                        onClick={chgLng(lng)}
                        disabled={lng === detectedLng}
                    >
                        {name}
                    </MenuItem>
                )}
            </MyMenu>
        </Box>
    )
}

export default LngSwitch




