import React from "react";
import {css} from "@emotion/react";
import Typ, {TypographyProps} from "@mui/material/Typography"
import styled from "@mui/material/styles/styled";
import {alpha} from "@mui/system/colorManipulator";

type TypBuilder = (initProps: TypographyProps & { component?: string }) => React.FC<TypographyProps>
const typBuilder: TypBuilder = (initProps) => (props) => {
    return <Typ sx={{textTransform: 'capitalize'}} {...initProps} {...props}/>
}

const Code = styled(typBuilder({component: 'code'}))(({theme}) => css`
  color: ${alpha(theme.palette.text.primary, 0.7)};
  background-color: ${theme.palette.grey.A100};
  font-size: .9rem;
  border-radius: .2rem;
  padding: 0.2rem 0.4rem 0;
  margin: 0 0.2rem;
  box-decoration-break: clone;
`)

const Blockquote = styled('blockquote')(({theme}) => css`
  margin: 1rem 0;
  padding: 0 1.5rem;
  color: ${theme.palette.text.primary};
  border-left: .25rem solid ${theme.palette.grey['300']};
`)

const Typography = {
    h1: typBuilder({variant: 'h1'}),
    h2: typBuilder({variant: 'h2'}),
    h3: typBuilder({variant: 'h3'}),
    h4: typBuilder({variant: 'h4'}),
    h5: typBuilder({variant: 'h5'}),
    h6: typBuilder({variant: 'h6'}),
    p: typBuilder({variant: 'body1', paddingLeft: '2px'}),
    caption: typBuilder({variant: 'caption'}),
    code: Code,
    blockquote: Blockquote
}

export default Typography
