import styled from "styled-components";
import { useRef, useEffect } from "react";
import autoAnimate from "@formkit/auto-animate";

import { SmallUserCircle, TooltipContainer } from "../styled-components";
import { BACKGROUND_COLOR, BUTTON_HOVER_BACKGROUND, DIVIDER_COLOR, MAIN_FONT_COLOR, SECONDARY_FONT_COLOR } from "../constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  z-index: 2;
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
  const navigate = useNavigate()
  const directToLogout = () => { navigate('/logout') }

  return (
    <RearContainer>
      <FrontContainer>
        <DividerLine/>
        <InnerContainer inactive={true} >
          Add an existing account
        </InnerContainer>
        <InnerContainer onClick={directToLogout}>
          Log out @{props.userName.toLowerCase()}
        </InnerContainer>
      </FrontContainer>
      <TalkBubbleTriangle/>
    </RearContainer>
  )
}

const ButtonContainer = styled(TooltipContainer)`
  padding: 12px;
  margin: 16px 0px;
  border-radius: 1000px;
  transition: background-color 200ms;
  
  &:hover {
    transition: background-color 200ms;
    ${props => props.linkTitle ?  `background-color: ${BUTTON_HOVER_BACKGROUND}` : ""}
  }
`

const UserAccountButton = (props) => {
  const parent = useRef(null)
  const userAccountInitial = props.displayName[0]

  const [menuDisplayed, setMenuDisplayed] = useState(false)

  const toggleAccountMenu = (event) => {
    if (!menuDisplayed) {
      event.stopPropagation()
      setMenuDisplayed(true)
      return
    }
    setMenuDisplayed(false)
  }
  

  useEffect(() => { parent.current && autoAnimate(parent.current) }, [parent])
  useEffect(() => {
    if (menuDisplayed) {
      window.addEventListener('click', toggleAccountMenu)
      return () => { window.removeEventListener('click', toggleAccountMenu) }
    }
  })

  return (
    <ButtonContainer linkTitle={menuDisplayed ? "" : "Account"} displayAbove={true} ref={parent}>
      <SmallUserCircle onClick={toggleAccountMenu}>{userAccountInitial}</SmallUserCircle>
      {menuDisplayed ? <UserAccountMenu userName={props.userName}></UserAccountMenu> : false }
    </ButtonContainer>
  )
}

export default UserAccountButton