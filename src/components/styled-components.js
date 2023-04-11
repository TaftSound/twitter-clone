import styled from "styled-components";
import { USER_ICON_COLOR, MAIN_FONT_COLOR, DIVIDER_COLOR, PRIMARY_COLOR, FONT_FAMILY, BUTTON_TOOLTIP_BACKGROUND, BUTTON_HOVER_BACKGROUND } from "./constants";

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

export const TooltipContainer = styled.div`
  position: relative;

  &::after {
    content: '${props => props.linkTitle}';
    position: absolute;
    z-index: 9999;
    width: max-content;
    padding: 2px 4px;
    border-radius: 2px;
    bottom: -21px;
    font-size: 12px;
    font-family: ${FONT_FAMILY};
    font-weight: 500;
    color: white;
    background-color: ${BUTTON_TOOLTIP_BACKGROUND};
    opacity: 0%;
    visibility: hidden;
    transition: opacity visibility 0ms 0s;
    user-select: none;
  }

  &:hover::after {
    visibility: ${props => props.linkTitle ? 'visible' : 'hidden' };
    opacity: 100%;
    transition: opacity 200ms .6s;
    transition: visibility 0ms .5s;
  }
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

const CloseButtonContainer = styled(TooltipContainer)`
  height: 34px;
  width: 34px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 200ms;
  cursor: pointer;

  &:hover {
    background-color: ${BUTTON_HOVER_BACKGROUND};
  }
`
const StyledButton = styled(StyledLogo)`
  height: 20px;
  width: 20px;
  fill: ${MAIN_FONT_COLOR};
`
export const CloseButton = (props) => {
  return (
    <CloseButtonContainer onClick={props.onClick} linkTitle="Close">
      <StyledButton path="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/>
    </CloseButtonContainer>
  )
}