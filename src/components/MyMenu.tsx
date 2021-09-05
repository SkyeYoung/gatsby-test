import Popper, {PopperProps} from "@material-ui/core/Popper";
import React from "react";
import Paper, {PaperProps} from "@material-ui/core/Paper";
import {ClickAwayListener, Grow, MenuList, MenuListProps} from "@material-ui/core";
import {ClickAwayListenerProps} from "@material-ui/core/ClickAwayListener/ClickAwayListener";
import styled from "@material-ui/core/styles/styled";
import {css} from "@emotion/react";
import {Nullable} from "../types/common";

const StyledPopper = styled(Popper)(({theme}) => css`
  position: absolute;
  z-index: ${theme.zIndex.tooltip};
`)

export interface MyMenuProps extends PopperProps {
    anchorEl: Nullable<HTMLElement>;
    PaperProps?: PaperProps;
    MenuListProps?: MenuListProps;
    variant?: MenuListProps['variant'];
    onClose: ((event?: (MouseEvent | TouchEvent)) => void);
}

const MyMenu = React.forwardRef<HTMLDivElement, MyMenuProps>(function MyMenu(inProps, ref) {
    const {
        PaperProps,
        MenuListProps,
        children,
        onClose,
        open,
        anchorEl,
        variant = 'selectedMenu',
        placement = 'bottom',
        ...PopperProps
    } = inProps

    const onClickAway: ClickAwayListenerProps['onClickAway'] = (event) => {
        if (!anchorEl?.contains(event.target as Node)) {
            onClose(event)
        }
    }

    return (
        <StyledPopper
            anchorEl={anchorEl}
            ref={ref}
            role="presentation"
            open={open}
            transition={true}
            keepMounted={true}
            disablePortal={true}
            modifiers={[
                {
                    name: 'preventOverflow',
                    enabled: true,
                    options: {
                        altAxis: true,
                        altBoundary: true,
                        tether: true,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                },
            ]}
            {...PopperProps}
        >
            {({TransitionProps, placement}) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin: placement === "bottom" ? "center top" : "center bottom"
                    }}
                >
                    <Paper {...PaperProps}>
                        <ClickAwayListener onClickAway={onClickAway}>
                            <MenuList {...MenuListProps}>
                                {children}
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </StyledPopper>)
})

export default MyMenu
