import React, {useRef, useState} from "react";
import {MdThumbUp} from "react-icons/md";
import styled from "@material-ui/core/styles/styled";
import {animated, useSpring} from "react-spring";
import Paper from "@material-ui/core/Paper";
import {css} from "@emotion/react";
import {alpha, IconButton} from "@material-ui/core";
import {observer} from "mobx-react-lite";
import {headerStore} from "../stores/stores";
import {useTranslation} from "react-i18next";
import {useScroll} from "@use-gesture/react";
import {window} from "../utils/common";

const StyledPaper = styled(animated(Paper))(({theme}) => css`
  position: absolute;
  right: 0;
  color: ${alpha(theme.palette.text.primary, 0.6)};

  &:hover {
    color: ${theme.palette.text.primary}
  }
`)

const Chip = styled('span')``

const VoteIcon: React.FC = () => <MdThumbUp size={20}/>

const UpVoteBtn = styled(IconButton)(({theme}) => css`
  &[aria-checked='true'] {
    color: ${theme.palette.primary.main};
  }
`)

const DnVoteBtn = styled(UpVoteBtn)`
  transform: rotate(180deg);
`

const Vote: React.FC = observer(() => {
    const paperRef = useRef<HTMLDivElement>(null);
    const [adsorbed, setAdsorbed] = useState(false);
    const toRight = 50
    const toTop = (headerStore.appear ? headerStore.height : 0) + 20
    const {t} = useTranslation(['common'])

    const {x, y} = useSpring({
        immediate: true,
        from: {x: 0, y: 0},
    })

    useScroll(({xy: [, curY]}) => {
        if (curY > 0) {
            if (!x.isAnimating && !adsorbed) {
                const paperRect = paperRef.current?.getBoundingClientRect() || {x: 0, y: 0, width: 0, height: 0}
                y.start(toTop - paperRect.y + paperRect.height)
                x.start(window.innerWidth - paperRect.x - paperRect.width - toRight)
                    .then((r) => {
                        if (r.finished) setAdsorbed(true)
                    })
            }
            // stop immediately to reduce wrong animation
            if ((x.isAnimating || y.isAnimating) && curY > 100) {
                x.stop()
                y.stop()
                setAdsorbed(true)
            }
        } else if (curY === 0 && adsorbed) {
            setAdsorbed(false)
            x.start(0)
            y.start(0)
        }
    }, {
        target: window
    })

    return (
        <StyledPaper
            ref={paperRef}
            elevation={adsorbed ? 2 : 0}
            style={
                adsorbed ? {} : {x, y}}
            sx={
                adsorbed ? {
                    position: "fixed",
                    right: toRight,
                    top: toTop,
                    transition: 'top 300ms',
                    padding: '2px 6px 0'
                } : {
                    position: "absolute",
                    bottom: "1.2rem"
                }
            }

        >
            <Chip>{t('common:vote.name')}</Chip>
            <UpVoteBtn title={t('common:vote.thumbUp')}><VoteIcon/></UpVoteBtn>
            <DnVoteBtn title={t('common:vote.thumbDown')}><VoteIcon/></DnVoteBtn>
        </StyledPaper>
    )
})

export default Vote
