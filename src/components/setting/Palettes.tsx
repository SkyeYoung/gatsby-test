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
import Typ from "../stand-in/Typography"
import {useScroll} from "@use-gesture/react";
import {window} from "../../utils/common";

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

    useScroll(({delta: [, deltaY]}) => {
        if (deltaY !== 0) {
            onClose()
        }
    }, {
        target: window
    })

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
                            gpuAcceleration: true,
                            adaptive: false,
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

const Wrapper = styled(Box)(({theme}) => css`
  display: inline-block;
  width: 160px;
  border-radius: 8px;
  border: 3px solid white;
  padding: 8px 4px 2px;
  margin: 10px;
  box-shadow: ${theme.shadows[2]};
`)

const Name = styled(Typography)`
  font-size: smaller;
  font-variant: small-caps;
  margin-top: 2px;
`

const Swatch = styled(Box)`
  height: 50px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.04);
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
        <Wrapper>
            <Swatch ref={ref} sx={{bgcolor: varColor(attr)}} onClick={onClick}/>
            <Name>
                {attr
                    .substring(2)
                    .split('-')
                    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
                    .join(' ')
                }
            </Name>
        </Wrapper>
    )
})

const StyledPalettes = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
`

const modes: ModeLabel[] = ['light', 'dark']

const Palettes: React.FC = observer(() => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <PalettePopper open={open} onClose={() => setOpen(false)}/>
            {
                modes.map((label) => {
                    return (
                        <>
                            <Typ.h1 key={label + '-name'}>{label}</Typ.h1>
                            <StyledPalettes key={label}>
                                {Array.from(varsStore[label].keys()).map((attr) =>
                                    varsStore[label].get(attr)?.includes(',') &&
                                    <Palette key={attr} label={label} attr={attr} setOpen={setOpen}/>
                                )}
                            </StyledPalettes>
                        </>
                    )
                })
            }
        </>
    )
})

export default Palettes
