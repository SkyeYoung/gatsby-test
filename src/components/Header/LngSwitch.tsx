import Box from "@material-ui/core/Box";
import React, {useContext, useState} from "react";
import Button, {ButtonProps} from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu"
import {Nullable} from "../../types/common";
import {useTranslation} from "react-i18next";
import {MenuItem} from "@material-ui/core";
import {I18nInfoContext} from "../../../plugins/gatsby-plugin-i18next/I18nWrapper";

const LngSwitch: React.FC = () => {
    const [anchorEle, setAnchorEle] = useState<Nullable<Element>>(null);
    const open = Boolean(anchorEle)
    const {supportedLngs} = useContext(I18nInfoContext)
    const {t, i18n} = useTranslation(['header'])

    const handleClick: ButtonProps['onClick'] = (event) => {
        setAnchorEle(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEle(null)
    }

    const chgLng = (lng: string) => {
        return async () => {
            await i18n.changeLanguage(lng)
            handleClose()
        }
    }

    return (
        <Box>
            <Button
                sx={{
                    color: 'white',
                    fontWeight: 'bold'
                }}
                id="language-switch"
                aria-controls="language-switch-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                title={t('header:toolbar.lng.title')}
                onClick={handleClick}
            >
                {t('header:toolbar.lng.name')}
            </Button>
            <Menu
                id="language-switch-menu"
                anchorEl={anchorEle}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'language-switch',
                }}
            >
                {supportedLngs
                    .map((lng) =>
                        <MenuItem key={lng} onClick={chgLng(lng)}>
                            {i18n.getResource(lng, 'header', 'toolbar.lng.name')}
                        </MenuItem>
                    )
                }
            </Menu>
        </Box>
    )
}

export default LngSwitch




