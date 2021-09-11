import styled from "@material-ui/core/styles/styled";
import {css} from "@emotion/react";

const listStyle = css`
  padding-inline-start: 0;
  margin-inline-start: 1rem;
`

const UList = styled('ul')(listStyle)

const OList = styled('ol')(listStyle)

const List = {
    ul: UList,
    ol: OList
}

export default List
