import React, {useCallback, useMemo, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import Box from "@material-ui/core/Box";
import {ModeLabel, varsStore} from "../../stores/css-vars-store";
import {RgbaStringColorPicker} from "react-colorful";
import {ClickAwayListener, Grow, Typography} from "@material-ui/core";
import {action, computed, observable} from "mobx";
import styled from "@material-ui/core/styles/styled";
import Popper, {PopperProps} from "@material-ui/core/Popper";
import {css} from "@emotion/react";
import Paper, {PaperProps} from "@material-ui/core/Paper";
import {Nullable} from "../../types/common";
import {VirtualElement} from '@popperjs/core';
import {varColor} from "../../utils/createCSSVarPalette";
import {ClickAwayListenerProps} from "@material-ui/core/ClickAwayListener/ClickAwayListener";

interface PalettePopperProps extends PopperProps {
    PaperProps?: PaperProps;
    onClose: ((event?: (MouseEvent | TouchEvent)) => void);
}

interface Color {
    label: ModeLabel,
    attr: string
}

interface PaletteProps extends Color {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PaletteStore {
    color: Color;
    el: Nullable<VirtualElement>;

    setColor(color: Partial<Color>): void;

    setEl(el: VirtualElement): void;
}


const paletteStore = observable<PaletteStore>({
    color: {
        label: 'light',
        attr: ''
    },
    el: null,

    setColor(color) {
        this.color = {...this.color, ...color}
    },
    setEl(el) {
        this.el = el
    },
}, {
    color: observable.deep,
    el: observable,

    setColor: action.bound,
    setEl: action.bound,
})

const DEFAULT_RECT: ClientRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
}

const StyledPopper = styled(Popper)(({theme}) => css`
  position: absolute;
  z-index: ${theme.zIndex.tooltip};
`)

const PalettePopper: React.FC<PalettePopperProps> = observer((inProps) => {
    const {
        PaperProps,
        children,
        onClose,
        open,
        placement = 'bottom',
        ...PopperProps
    } = inProps

    const ref = useRef<HTMLDivElement>(null);
    const pointerEvents = useMemo(() => open ? 'auto' : 'none', [open]);

    const transition = computed(() => {
        const popperRect = ref.current?.getBoundingClientRect() || DEFAULT_RECT
        return popperRect.left === 0 || popperRect.top === 0
            ? undefined
            : 'transform 225ms ease-in-out'
    }).get()
    const color = computed(() => varsStore.getWithKey(paletteStore.color.label, paletteStore.color.attr)).get()

    const setColor = useCallback(
        (color: string) => {
            const val = color.match(/^rgba\((.+)\)$/)
            if (val) {
                varsStore.setWithKey(paletteStore.color.label, paletteStore.color.attr, val[1])
            }
        },
        [],
    );

    const onClickAway: ClickAwayListenerProps['onClickAway'] = (event) => {
        if (!paletteStore.el?.contextElement?.contains(event.target as Node)) {
            onClose(event)
        }
    }

    return (
        <ClickAwayListener onClickAway={onClickAway}>
            <StyledPopper
                ref={ref}
                anchorEl={paletteStore.el}
                role="presentation"
                open={open}
                sx={{pointerEvents, transition}}
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
                    {
                        name: 'computeStyles',
                        options: {
                            adaptive: false, // true by default
                        },
                    },
                ]}
                {...PopperProps}
            >
                {({TransitionProps, placement}) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                        }}
                    >
                        <Paper {...PaperProps}>
                            <RgbaStringColorPicker color={color} onChange={setColor}/>
                        </Paper>
                    </Grow>
                )}
            </StyledPopper>
        </ClickAwayListener>
    )
})

const Name = styled(Typography)`
  font-size: 12px;
`

const Swatch = styled(Box)`
  display: inline-list-item;
  border: 3px solid white;
  border-radius: 8px;
  width: 140px;
  height: 50px;
  cursor: pointer;
  margin: 10px;
  padding: 2px 4px;
`

const Palette: React.FC<PaletteProps> = observer((props) => {
    const {label, attr, setOpen} = props
    const ref = useRef<HTMLElement>(null);

    const onClick = () => {
        if (ref.current === null) return

        if (paletteStore.color.attr === attr) {
            setOpen(prevState => !prevState)
        } else {
            setOpen(true)
        }

        paletteStore.setColor({
            label,
            attr
        })

        const rect = ref.current.getBoundingClientRect()
        paletteStore.setEl({
            getBoundingClientRect: rect ? () => rect : () => DEFAULT_RECT,
            contextElement: ref.current
        })
    }

    return (
        <Swatch ref={ref} sx={{bgcolor: varColor(attr), boxShadow: 1}} onClick={onClick}>
            <Name>{attr.substring(2)}</Name>
        </Swatch>
    )
})

const Palettes: React.FC = observer(() => {
    const [open, setOpen] = useState(false);

    return (
        <Box>
            <PalettePopper open={open} onClose={() => setOpen(false)}/>
            {Array.from(varsStore.light.keys()).map((v) =>
                varsStore.light.get(v)?.includes(',') &&
                <Palette key={v} label={'light'} attr={v} setOpen={setOpen}/>
            )}
        </Box>
    )
})

export default Palettes
