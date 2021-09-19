import Box from "@material-ui/core/Box";
import React from "react";
import {observer} from "mobx-react-lite";
import IconButton from "@material-ui/core/IconButton";
import {RiMenuFoldLine, RiMenuUnfoldLine} from "react-icons/ri";
import {headerStore} from "../stores/stores";
import styled from "@material-ui/core/styles/styled";
import {css} from "@emotion/react";
import {navSidebarStore} from "../stores/sidebar-store";

const ICON_SIZE = 40
const BTN_SIZE = ICON_SIZE + 20

const StyledIconBtn = styled(IconButton)`
  position: absolute;
  top: 0;
  width: ${BTN_SIZE}px;
  height: ${BTN_SIZE}px;

  opacity: 0.2;
  transition: opacity 225ms;

  &:hover {
    opacity: 1;
  }
`

const NavCollapseBtn = observer(() => {
    return (
        <StyledIconBtn
            aria-label="collapse nav sidebar"
            onClick={navSidebarStore.toggleCollapsed}
            sx={{right: -BTN_SIZE}}>
            {navSidebarStore.collapsed
                ? <RiMenuUnfoldLine size={ICON_SIZE}/>
                : <RiMenuFoldLine size={ICON_SIZE}/>
            }
        </StyledIconBtn>
    )
})

const WrapperBox = styled(Box)(({theme}) => css`
  border-inline: 1px solid ${theme.palette.divider};
  position: sticky;
  z-index: 1;
  transition: all 225ms ease-in-out;
  box-sizing: border-box;
`)

const ContainerBox = styled(Box)`
  overflow-y: auto;
  position: absolute;
  height: inherit;
  width: 100%;
  transition: transform 225ms;
`

const NavSidebar: React.FC<{ toc: string }> = observer((props) => {
    const top = headerStore.appear ? headerStore.height : 0
    const width = navSidebarStore.collapsed ? 0 : navSidebarStore.width
    const translateX = navSidebarStore.collapsed ? -navSidebarStore.width : 0

    return (
        <WrapperBox sx={{
            top,
            width,
            height: `calc(100vh - ${top}px)`,
            borderLeft: 'unset',
        }}>
            <ContainerBox sx={{
                transform: `translateX(${translateX}px)`,
            }}>
                <Box dangerouslySetInnerHTML={{__html: props.toc}}/>
            </ContainerBox>
            <NavCollapseBtn/>
        </WrapperBox>
    )
})

export default NavSidebar
export {WrapperBox, ContainerBox, StyledIconBtn, BTN_SIZE, ICON_SIZE}
