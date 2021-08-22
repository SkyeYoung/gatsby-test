import React from "react";
import Box, {BoxProps} from "@material-ui/core/Box";
import {css} from "@emotion/react";
import {IconButton, IconButtonProps} from "@material-ui/core";
import {MdNavigateBefore, MdNavigateNext} from "react-icons/md";
import {IconType} from "react-icons";
import Footer from "./Footer";
import {observer} from "mobx-react-lite";
import styled from "@material-ui/core/styles/styled";

const Content = styled(Box)(({theme}) => css`
  flex-grow: 1;
  margin: auto;
  padding: 0 120px 120px;

  ${theme.breakpoints.down('xl')} {
    min-width: 1000px;
  }

  ${theme.breakpoints.down('lg')} {
    min-width: 800px;
  }
`)

const NavBtn: React.FC<IconButtonProps & { Icon: IconType }> = observer((props) => {
    const {Icon, sx, ...others} = props
    return <IconButton
        sx={{
            position: "fixed",
            top: "60%",
            margin: "0 20px",
            opacity: 0.2,
            transition: "opacity 0.3s",
            '&:hover': {
                opacity: 1
            },
            ...sx
        }}
        {...others}>
        <Icon size={'60px'}/>
    </IconButton>
})

const PrevNavBtn = observer(() => (
    <NavBtn Icon={MdNavigateBefore} aria-label={'prev'}/>
))

const NextNavBtn = observer(() => (
    <NavBtn Icon={MdNavigateNext} aria-label={'next'} sx={{right: 0}}/>
))

const Main: React.FC<BoxProps> = observer((props) => {
    const {children, ...others} = props

    return (
        <Box sx={{
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
            position: 'relative',
        }} {...others}>
            <Content>{children}</Content>

            <PrevNavBtn/>
            <NextNavBtn/>
            <Footer/>
        </Box>
    )
})

export default Main
