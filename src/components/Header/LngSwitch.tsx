import Box from "@material-ui/core/Box";
import React, {useContext, useState} from "react";
import Button, {ButtonProps} from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu"
import {Nullable} from "../../types/common";
import {useTranslation} from "react-i18next";
import {I18nInfoContext, I18nUtilContext} from "../../../plugins/gatsby-plugin-i18next/I18nWrapper";
import MenuItem from "@material-ui/core/MenuItem";

const LngSwitch: React.FC = () => {
    const [anchorEle, setAnchorEle] = useState<Nullable<Element>>(null);
    const open = Boolean(anchorEle)
    const {t} = useTranslation(['header'])
    const infoContext = useContext(I18nInfoContext);
    const utilContext = useContext(I18nUtilContext);

    const handleClick: ButtonProps['onClick'] = (event) => {
        setAnchorEle(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEle(null)
    }

    const chgLng = (lng: string) => {
        return async () => {
            await utilContext.changeLng(lng)
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
            {infoContext.supportedLngs
                ? <Menu
                    id="language-switch-menu"
                    anchorEl={anchorEle}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'language-switch',
                    }}
                >
                    {
                        Object.entries(infoContext.supportedLngs)?.map(([lng, name]) =>
                            <MenuItem key={lng} onClick={chgLng(lng)}>
                                {name}
                            </MenuItem>
                        )}
                </Menu>
                : null}
        </Box>
    )
}

export default LngSwitch




