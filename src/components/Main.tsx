import React from "react";
import Box, {BoxProps} from "@material-ui/core/Box";
import styled from "@emotion/styled";
import {css} from "@emotion/react";
import {IconButton, IconButtonProps, useTheme} from "@material-ui/core";
import {MdNavigateBefore, MdNavigateNext} from "react-icons/all";
import {IconType} from "react-icons";
import Footer from "./Footer";

const Content = styled(Box)(() => {
    const theme = useTheme()
    return css`
      flex-grow: 1;
      margin: auto;
      padding: 0 120px 120px;

      ${theme.breakpoints.down('xl')} {
        min-width: 1000px;
      }

      ${theme.breakpoints.down('lg')} {
        min-width: 800px;
      }
    `
})

const NavBtn: React.FC<IconButtonProps & { Icon: IconType, label: string }> = (props) => {
    const {Icon, label, sx, ...others} = props
    return <IconButton
        aria-label={label}
        sx={{
            position: "fixed",
            top: "60%",
            margin: "0 20px",
            opacity: 0.4,
            transition: "opacity 0.3s",
            '&:hover': {
                opacity: 1
            },
            ...sx
        }}
        {...others}>
        <Icon size={'60px'}/>
    </IconButton>
}


const Nav: React.FC = () => {
    return (
        <>
            <NavBtn Icon={MdNavigateBefore} label={'prev'} sx={{left: '250px'}}/>
            <NavBtn Icon={MdNavigateNext} label={'next'} sx={{right: 0}}/>
        </>
    )
}

const NavMemo = React.memo(Nav, () => true)

const Main: React.FC<BoxProps> = (props) => {
    const {children, ...others} = props
    return (
        <Box sx={{display: 'flex', flexFlow: 'column', flexGrow: 1, position: 'relative'}}  {...others}>
            <Content>{children}</Content>
            <NavMemo/>
            <Footer/>
        </Box>
    )
}

export default Main
