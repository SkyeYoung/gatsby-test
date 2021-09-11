import styled from "@material-ui/core/styles/styled";
import Typography from "./stand-in/Typography";
import React from "react";
import Box from "@material-ui/core/Box";


const StyledH1 = styled(Typography.h1)`
  margin-top: 2.5rem;
  flex-grow: 1;
`

const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
  position: relative;
`

const Title: React.FC = (props) => {
    const {children} = props
    return (
        <StyledBox>
            <StyledH1>{children}</StyledH1>
        </StyledBox>
    )
}

export default Title
