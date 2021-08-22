import Typography, {TypographyProps} from "@material-ui/core/Typography";
import React from "react";
import styled from "@material-ui/core/styles/styled";
import {css} from "@emotion/react";
import {alpha} from "@material-ui/core";

type TypoBuilder = (initProps: TypographyProps & { component?: string }) => React.FC<TypographyProps>
const typoBuilder: TypoBuilder = (initProps) => (props) => {
    return <Typography {...initProps} {...props}/>
}

const Code = styled(typoBuilder({component: 'code'}))(({theme}) => css`
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

const Typo = {
    h1: typoBuilder({variant: 'h1'}),
    h2: typoBuilder({variant: 'h2'}),
    h3: typoBuilder({variant: 'h3'}),
    h4: typoBuilder({variant: 'h4'}),
    h5: typoBuilder({variant: 'h5'}),
    h6: typoBuilder({variant: 'h6'}),
    p: typoBuilder({variant: 'body1', paddingLeft: '2px'}),
    caption: typoBuilder({variant: 'caption'}),
    code: Code,
    blockquote: Blockquote
}

export default Typo
