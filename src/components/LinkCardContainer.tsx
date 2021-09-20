import React, {createRef, MouseEventHandler} from "react";
import {animated, useSpring} from "react-spring";
import {action, observable} from "mobx";
import {observer} from "mobx-react-lite";
import {css} from "@emotion/react";
import {Property} from "csstype";
import {getWindowSize} from "../utils/common";
import Card from "@mui/material/Card";
import styled from "@mui/material/styles/styled";
import CardContent from "@mui/material/CardContent";

interface Status {
    x: number;
    y: number;
    opacity: number;
}

interface LinkCardStore {
    from: Status;
    to: Status;
    show: boolean;
    pointerEvents: Property.PointerEvents;

    setFrom(status: Partial<Status>): void;

    setTo(status: Partial<Status>): void;

    setShow(val: boolean): void;

    setPointerEvents(val: Property.PointerEvents): void;
}

const linkCardStore = observable<LinkCardStore>({
    from: {
        x: 0,
        y: 0,
        opacity: 0
    },
    to: {
        x: 0,
        y: 0,
        opacity: 0
    },
    show: false,
    pointerEvents: 'none',

    setFrom(status) {
        this.from = {...this.from, ...status}
    },
    setTo(status) {
        this.to = {...this.from, ...status}
    },
    setShow(status) {
        this.show = status
    },
    setPointerEvents(val) {
        this.pointerEvents = val
    }
}, {
    from: observable.ref,
    to: observable.ref,
    show: observable,
    pointerEvents: observable,
    setFrom: action.bound,
    setTo: action.bound,
    setShow: action.bound,
    setPointerEvents: action.bound
})

const SPACING = 20

const StyledCard = styled(animated(Card))(({theme}) => css`
  position: fixed;
  z-index: ${theme.zIndex.tooltip};
  opacity: 0;
  pointer-events: none;
  width: 320px;
  max-width: calc(100vw - ${SPACING * 2}px);
`)

const linkCardRef = createRef<HTMLDivElement>()

const LinkCardContainer: React.FC = observer(() => {
    const {x, y, opacity} = useSpring({
        from: linkCardStore.from,
        to: linkCardStore.to,
        delay: 100,
        onChange: {
            opacity: (result) => {
                linkCardStore.setPointerEvents(result.value > 0.8 ? 'auto' : 'none')
            }
        },
        config: {
            duration: 225
        }
    })

    return (
        <StyledCard ref={linkCardRef} style={{x, y, opacity, pointerEvents: linkCardStore.pointerEvents}}>
            <CardContent>
                测试内容
            </CardContent>
        </StyledCard>
    )
})

const bindLinkCard = () => {
    type EventFunc = MouseEventHandler<HTMLAnchorElement>

    let el: EventTarget & HTMLAnchorElement;

    const onMouseEnter: EventFunc = (e) => {
        if (!linkCardRef.current) return

        if (!el) el = e.currentTarget
        const elRect = el.getBoundingClientRect()
        const cardRect = linkCardRef.current?.getBoundingClientRect() || {x: 0, y: 0, width: 0, height: 0}
        const viewport = getWindowSize()

        let to: Status = {
            x: elRect.x + elRect.width / 2 - cardRect.width / 2,
            y: elRect.y < viewport.height / 2 ? elRect.bottom + SPACING / 2 : elRect.top - cardRect.height - SPACING / 2,
            opacity: 1
        }

        // to left
        if (to.x < 0) {
            to.x = SPACING
        }
        // to right
        const toRight = viewport.width - to.x - cardRect.width
        if (toRight < 0) {
            to.x += toRight - SPACING
        }

        const from = linkCardStore.to
        // start nearby maybe better
        if (Math.abs(from.x - to.x) > 50 || Math.abs(from.y - to.y) > 50) {
            const oriDis = Math.sqrt((from.y - to.y) ** 2 + (from.x - to.x) ** 2)
            const betterDis = 50
            const multiple = Math.abs(betterDis / oriDis)

            linkCardStore.setFrom({
                x: multiple * (from.x - to.x) + to.x,
                y: multiple * (from.y - to.y) + to.y,
            })
        } else {
            linkCardStore.setFrom(from)
        }

        linkCardStore.setTo(to)
    }

    const onMouseLeave: EventFunc = () => {
        linkCardStore.setFrom(linkCardStore.to)
        linkCardStore.setTo({
            opacity: 0
        })
    }

    return {
        onMouseEnter,
        onMouseLeave,
        onMouseDown: onMouseLeave
    }
}

export {bindLinkCard}
export default LinkCardContainer
