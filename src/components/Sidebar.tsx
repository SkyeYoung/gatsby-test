import Box from "@material-ui/core/Box";
import React from "react";
import {observer} from "mobx-react-lite";
import IconButton from "@material-ui/core/IconButton";
import {RiMenuFoldLine, RiMenuUnfoldLine} from "react-icons/ri";
import {headerStore, sidebarStore} from "../stores";

const CollapseBtn = observer(() => {
    const ICON_SIZE = 40
    const BTN_SIZE = ICON_SIZE + 20

    return (
        <IconButton
            aria-label="collapse sidebar"
            onClick={sidebarStore.toggle}
            sx={{
                position: "absolute",
                top: 0,
                right: -BTN_SIZE,
                borderRadius: 'unset',
                width: BTN_SIZE,
                height: BTN_SIZE
            }}>
            {sidebarStore.collapsed
                ? <RiMenuUnfoldLine size={ICON_SIZE}/>
                : <RiMenuFoldLine size={ICON_SIZE}/>
            }
        </IconButton>
    )
})

const Sidebar: React.FC<{ toc: string }> = observer((props) => {
    const toTop = headerStore.appear ? headerStore.height : 0

    return (
        <Box sx={{
            width: -sidebarStore.toLeft,
            height: `calc(100vh - ${toTop}px)`,
            borderRight: "1px solid #dfdfdf",
            position: "sticky",
            zIndex: 1,
            top: toTop,
            transition: "all 225ms ease-out",
        }}>
            <Box sx={{
                overflowY: "auto",
                position: "relative",
                height: "inherit",
                width: sidebarStore.width,
                transform: `translateX(${sidebarStore.collapsed ? -sidebarStore.width : 0}px)`,
                transition: "transform 225ms"
            }}>
                <Box dangerouslySetInnerHTML={{__html: props.toc}}/>
            </Box>
            <CollapseBtn/>
        </Box>
    )
})

export default Sidebar
