import styled from "styled-components";
import { useRef, useEffect, useContext } from "react";
import autoAnimate from "@formkit/auto-animate";

import { FlexBox, SmallUserCircle, TooltipContainer } from "../styled-components";
import { BACKGROUND_COLOR, BUTTON_HOVER_BACKGROUND, DIVIDER_COLOR, MAIN_FONT_COLOR, SECONDARY_FONT_COLOR } from "../constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";

const RearContainer = styled.div`
  position: absolute;
  top: -122px;
  left: 0px;
  background-color: ${BACKGROUND_COLOR};
  box-shadow: 0px 0px 7px 0px rgb(255, 255, 255, 0.4);
  width: 300px;
  border-radius: 15px;
`
const FrontContainer = styled.div`
  position: relative;
  z-index: 6;
  padding: 12px 0px;
  border-radius: 15px;
  background-color: ${BACKGROUND_COLOR};
`
const TalkBubbleTriangle = styled.div`
  position: absolute;
  z-index: 1;
  bottom: -5px;
  left: 20px;
  transform: rotate(45deg);
  height: 10px;
  width: 10px;
  background-color: ${BACKGROUND_COLOR};
  box-shadow: 2px 2px 3px 0px rgb(255, 255, 255, 0.2);
`
const DividerLine = styled.div`
  width: 100%;
  background-color: ${DIVIDER_COLOR};
  height: 1px;
`
const InnerContainer = styled.div`
  box-sizing: border-box;
  width: 300px;
  height: 44px;
  padding: 12px 16px;
  font-weight: 700;
  cursor: pointer;

  color: ${props => props.inactive ? `${SECONDARY_FONT_COLOR}` : `${MAIN_FONT_COLOR}`};
  /* ${props => props.inactive ? 'text-decoration: line-through;' : ""} */

  &:hover {
    background-color: ${BUTTON_HOVER_BACKGROUND}
  }
`

const UserAccountMenu = (props) => {
  const logoutButtonRef = useRef(null)
  const userContext = useContext(UserContext)
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const logoutButton = logoutButtonRef.current

    const directToLogout = () => {
      navigate('/logout')
    }

    logoutButton.addEventListener('click', directToLogout)

    return () => { logoutButton.removeEventListener('click', directToLogout) }
  }, [navigate])

  useEffect(() => {
    if (userContext) { setUserName(userContext.userName) }
  }, [userContext])

  return (
    <RearContainer>
      <FrontContainer>
        <DividerLine/>
        <InnerContainer inactive={true} >
          Add an existing account
        </InnerContainer>
        <InnerContainer ref={logoutButtonRef}>
          Log out @{userName}
        </InnerContainer>
      </FrontContainer>
      <TalkBubbleTriangle/>
    </RearContainer>
  )
}

const OuterContainer = styled.div`
  position: relative;
  margin: 12px 0px;

  @media (min-width: 1265px) {
    width: 100%;
  }
`
const ButtonContainer = styled(TooltipContainer)`
  padding: 12px;
  border-radius: 1000px;
  transition: background-color 200ms;
  display: flex;
  cursor: pointer;

  ${props => props.clickable ? '' : 'pointer-events: none;'}
  
  &:hover {
    transition: background-color 200ms;
    ${props => props.linkTitle ?  `background-color: ${BUTTON_HOVER_BACKGROUND}` : ""}
  }
`
const DisplayName = styled.h3`
  width: 100%;
  margin: 0px;
  font-size: 16px;
  font-weight: 700;
  color: ${MAIN_FONT_COLOR};
  display: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 1265px) {
    display: block;
  }
`
const UserName = styled(DisplayName)`
  font-weight: 400;
  color: ${SECONDARY_FONT_COLOR};
`

const StyledSvg = styled.svg`
  height: 18.75px;
  width: 18.75px;
  fill: ${MAIN_FONT_COLOR};
`

const UserDetails = styled(FlexBox)`
  display: none;

  @media (min-width: 1265px) {
    display: flex;
  }
`

const UserAccountButton = (props) => {
  const parent = useRef(null)
  const userContext = useContext(UserContext)

  const [menuDisplayed, setMenuDisplayed] = useState(false)
  const [clickable, setClickable] = useState(true)

  const toggleAccountMenu = (event) => {
    if (!menuDisplayed) {
      event.stopPropagation()
      setMenuDisplayed(true)
      setClickable(false)
      return
    }
    setMenuDisplayed(false)
    setClickable(true)
  }
  

  useEffect(() => { parent.current && autoAnimate(parent.current, { duration: 100 }) }, [parent])
  useEffect(() => {
    if (menuDisplayed) {
      window.addEventListener('click', toggleAccountMenu)
      return () => { window.removeEventListener('click', toggleAccountMenu) }
    }
  })

  if (userContext) return (
    <OuterContainer>
      <ButtonContainer clickable={clickable} onClick={toggleAccountMenu} linkTitle={menuDisplayed ? "" : "Accounts"} displayAbove={true} ref={parent}>
        <SmallUserCircle userData={userContext} onClick={() => {}}></SmallUserCircle>
        <UserDetails alignItems="center" width="195px" justifyContent="space-between">
          <FlexBox direction="column" margin="0px 4px 0px 12px" width="calc(100% - 34.75px)">
            <DisplayName>{userContext.displayName}</DisplayName>
            <UserName>@{userContext.userName}</UserName>
          </FlexBox>
          <StyledSvg viewBox="0 0 24 24">
            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
          </StyledSvg>
        </UserDetails>
      </ButtonContainer>
      {menuDisplayed ? <UserAccountMenu></UserAccountMenu> : false }
    </OuterContainer>
  )
}

export default UserAccountButton