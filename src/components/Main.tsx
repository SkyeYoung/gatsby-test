import React from "react";
import {MdNavigateBefore, MdNavigateNext} from "react-icons/md";
import {IconType} from "react-icons";
import Footer from "./Footer";
import {observer} from "mobx-react-lite";
import {navSidebarStore, tocSidebarStore} from "../stores/sidebar-store";
import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import Box, {BoxProps} from "@mui/material/Box";
import styled from "@mui/material/styles/styled";

const Content = styled(Box)`
  flex-grow: 1;
  margin: auto;
  padding: 0 50px 120px;
`

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
    const width = `calc(100vw - ${navSidebarStore.width + tocSidebarStore.width}px)`

    return (
        <Box sx={{
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
            position: 'relative',
        }} {...others}>
            <Content sx={{
                width
            }}>{children}</Content>

            <PrevNavBtn/>
            <NextNavBtn/>
            <Footer/>
        </Box>
    )
})

export default Main
