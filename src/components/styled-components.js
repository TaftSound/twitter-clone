
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import { USER_ICON_COLOR, DIVIDER_COLOR, PRIMARY_COLOR, FONT_FAMILY, BUTTON_TOOLTIP_BACKGROUND, SECONDARY_FONT_COLOR, BACKGROUND_COLOR } from "./constants";

const UserCircleContainer = styled.button`
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
  ${props => props.imageUrl && 'background-color: transparent;'}
  color: white;
  overflow: hidden;
  cursor: pointer;
`

const ProfileImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  ${props => `transform: translate(${-50 + props.transformX}%, ${-50 + props.transformY}%);`}
  ${props => props.zoom && `width: ${props.zoom * 100}%;`}
`

export const UserCircle = (props) => {
  const userContext = useContext(UserContext)
  const { userData } = props
  const { profileImageAdjustment } = userData
  const navigate = useNavigate()

  const visitProfile = () => {
    if (userContext.userId === userData.userId) {
      navigate('/user-profile')
    } else {
      navigate(`/visit-profile/${userData.userId}`)
    }
  }

  if (props.children) {
    return (
      <UserCircleContainer className={props.className} onClick={props.onClick}>
        {props.children}
      </UserCircleContainer>
    )
  }

  return (
    <UserCircleContainer imageUrl={userData.profileImageUrl} className={props.className} onClick={props.onClick || visitProfile}>
      {!userData.profileImageUrl && userData.displayName[0]}
      {userData.profileImageUrl
      && <ProfileImage src={userData.profileImageUrl}
                   transformX={profileImageAdjustment.transformX}
                   transformY={profileImageAdjustment.transformY}
                   zoom={profileImageAdjustment.zoom}></ProfileImage>}
    </UserCircleContainer>
  )
}

export const LargeUserCircle = styled(UserCircle)`
  box-sizing: content-box;
  padding: 0px;
  height: 44px;
  width: 44px;
  font-size: 75px;
  ${props => props.userData.profileImageUrl ? `background-color: ${BACKGROUND_COLOR};` : ''}
  border: solid 2px ${BACKGROUND_COLOR};
  position: absolute;
  left: 16px;
  transform: translateY(-50%);
  overflow: hidden;

  @media (min-width: 262px) {
    // Padding bottom trick
    width: calc(23%);
    height: 0px;
    padding-bottom: calc(23%);
  }

  @media (min-width: 600px) {
    width: calc(25% - 16px);
    padding-bottom: calc(25% - 16px);
    border: solid 4px ${BACKGROUND_COLOR};
  }

  @media (min-width: 690px) {
    border: solid 4px ${BACKGROUND_COLOR};
    height: 133.5px;
    width: 133.5px;
    padding-bottom: 0px;
  }
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
  ${props => props.flex && `flex: ${props.flex};`}
  ${props => props.gap && `gap: ${props.gap};`}
  ${props => props.position && `position: ${props.position};`}
  ${props => props.top && `top: ${props.top};`}
  ${props => props.right && `right: ${props.right};`}
  ${props => props.bottom && `bottom: ${props.bottom};`}
  ${props => props.left && `left: ${props.left};`}
  ${props => props.transform && `transform: ${props.transform};`}
  ${props => props.zIndex && `z-index: ${props.zIndex};`}
  ${props => props.overflow && `overflow: ${props.overflow};`}
  ${props => props.height && `height: ${props.height};`}
  ${props => props.width && `width: ${props.width};`}
  ${props => props.margin && `margin: ${props.margin};`}
  ${props => props.padding && `padding: ${props.padding};`}
  ${props => props.direction && `flex-direction: ${props.direction};`}
  ${props => props.alignItems && `align-items: ${props.alignItems};`}
  ${props => props.justifyContent && `justify-content: ${props.justifyContent};`}
  ${props => props.backgroundColor && `background-color: ${props.backgroundColor};`}
  ${props => props.borderRadius && `border-radius: ${props.borderRadius};`}
`
