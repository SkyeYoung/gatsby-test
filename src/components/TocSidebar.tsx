import {observer} from "mobx-react-lite";
import {tocSidebarStore} from "../stores/sidebar-store";
import {RiMenuFoldLine, RiMenuUnfoldLine} from "react-icons/ri";
import React from "react";
import {BTN_SIZE, ContainerBox, ICON_SIZE, StyledIconBtn, WrapperBox} from "./NavSidebar";
import {headerStore} from "../stores/stores";
import Box from "@mui/material/Box";

const TocCollapseBtn = observer(() => {
    const icon = tocSidebarStore.collapsed
        ? <RiMenuFoldLine size={ICON_SIZE}/>
        : <RiMenuUnfoldLine size={ICON_SIZE}/>

    return (
        <StyledIconBtn
            aria-label="collapse toc sidebar"
            onClick={tocSidebarStore.toggleCollapsed}
            sx={{left: -BTN_SIZE}}>
            {icon}
        </StyledIconBtn>
    )
})


const TocSidebar: React.FC<{ toc: string }> = observer((props) => {
    const top = headerStore.appear ? headerStore.height : 0
    const width = tocSidebarStore.collapsed ? 0 : tocSidebarStore.width

    return (
        <WrapperBox sx={{
            top,
            width,
            height: `calc(100vh - ${top}px)`,
            borderRight: 'unset',
        }}>
            <ContainerBox>
                <Box dangerouslySetInnerHTML={{__html: props.toc}}/>
            </ContainerBox>
            <TocCollapseBtn/>
        </WrapperBox>
    )
})

export default TocSidebar
