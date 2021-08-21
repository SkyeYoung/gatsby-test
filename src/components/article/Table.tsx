import React from "react";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import MTable, {TableProps} from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import styled from "@material-ui/core/styles/styled";
import {css} from "@emotion/react";

const StyledTable: React.FC<TableProps> = (props) => {
    const {sx, ...others} = props

    return (
        <TableContainer component={Paper} sx={{
            display: 'inline-block',
            maxWidth: '100%',
            width: 'auto',
        }}>
            <MTable sx={{
                maxWidth: '100%',
                width: 'auto',
                lineHeight: '1.4rem',
                ...sx
            }} {...others}/>
        </TableContainer>
    )
}

const StyledTd = styled(TableCell)`
  padding: 14px 20px;
`

const StyledTh = styled(StyledTd)(({theme}) => css`
  font-weight: ${theme.typography.fontWeightBold};
  background-color: ${theme.palette.grey.A700};
  color: white;
  min-width: 0;
  vertical-align: center;
  padding: 12px 20px;
`)

const StyledTr = styled(TableRow)(({theme}) => css`
  transition: background-color ${theme.transitions.duration.shortest}ms;

  &:hover {
    background-color: ${theme.palette.grey.A100};
  }
`)

const Table = {
    table: StyledTable,
    thead: TableHead,
    tbody: TableBody,
    tr: StyledTr,
    th: StyledTh,
    td: StyledTd
}

export default Table
