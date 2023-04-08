import styled from "styled-components";
import { USER_ICON_COLOR, MAIN_FONT_COLOR, DIVIDER_COLOR, PRIMARY_COLOR } from "./constants";

export const UserCircle = styled.button`
  border-radius: 50%;
  font-size: 28px;
  height: 47.5px;
  width: 47.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${USER_ICON_COLOR};
  color: ${MAIN_FONT_COLOR};
`

export const SmallUserCircle = styled(UserCircle)`
  font-size: 24px;
  height: 40px;
  width: 40px;
`

export const DividerLine = styled.div`
  height: 1px;
  width: 99%;
  background-color: ${DIVIDER_COLOR};
`

export const Container = styled.div`
  display: flex;
  padding: ${props => props.padding || "0px"};
  margin: ${props => props.margin || "0px"};
  flex-direction: ${props => props.flexDirection || "row"};
`

const Logo = (props) => {
  return (
  <svg viewBox="0 0 24 24" className={props.className}>
    <path d={props.path}></path>
  </svg>
  )
}

export const StyledLogo = styled(Logo)`
height: 16px;
width: 16px;
fill: ${PRIMARY_COLOR};
`