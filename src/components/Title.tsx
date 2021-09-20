import Typography from "./stand-in/Typography";
import React from "react";
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";


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
