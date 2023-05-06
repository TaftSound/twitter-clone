import styled from "styled-components";
import { USER_ICON_COLOR, MAIN_FONT_COLOR, DIVIDER_COLOR, PRIMARY_COLOR, FONT_FAMILY, BUTTON_TOOLTIP_BACKGROUND, SECONDARY_FONT_COLOR } from "./constants";

export const UserCircle = styled.button`
  position: relative;
  z-index: 5;
  border-radius: 50%;
  font-size: 28px;
  height: 47.5px;
  width: 47.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${USER_ICON_COLOR};
  color: white;
`

export const SmallUserCircle = styled(UserCircle)`
  font-size: 24px;
  height: 40px;
  width: 40px;
  cursor: pointer;
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
    ${props => !props.linkTitle ? 'display: none;' : ''}
    content: '${props => props.linkTitle}';
    position: absolute;
    z-index: 5;
    width: max-content;
    padding: 2px 4px;
    border-radius: 2px;
    ${props => props.displayAbove ? 'top: -21px;' : 'bottom: -21px;'}
    left: 50%;
    transform: translate(-50%, 0%);
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
    transition: opacity 150ms .7s;
    transition: visibility 0ms .6s;
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
export const SmallGreyLogo = styled(Logo)`
  height: 18.75px;
  width: 18.75px;
  fill: ${SECONDARY_FONT_COLOR};
`

export const FlexBox = styled.div`
  display: flex;
  ${props => props.height && `height: ${props.height};`}
  ${props => props.width && `width: ${props.width};`}
  ${props => props.margin && `margin: ${props.margin};`}
  ${props => props.padding && `padding: ${props.padding};`}
  ${props => props.direction && `flex-direction: ${props.direction};`}
  ${props => props.alignItems && `align-items: ${props.alignItems};`}
  ${props => props.justifyContent && `justify-content: ${props.justifyContent};`}
`
