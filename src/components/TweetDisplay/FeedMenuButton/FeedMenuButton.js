import styled from "styled-components"
import autoAnimate from "@formkit/auto-animate"

import { BUTTON_HOVER_BACKGROUND, PRIMARY_COLOR } from "../../constants"
import { useState, useEffect, useRef } from "react"
import { TooltipContainer } from "../../styled-components"
import { SmallMenuButton } from "../../StyledButtons/SmallMenuButton"
import ButtonPopupMenu from "./ButtonPopupMenu"


const OuterContainer = styled.div`
  position: relative;
`
const ButtonContainer = styled(TooltipContainer)`
  border-radius: 1000px;
  transition: background-color 200ms;

  ${props => props.clickable ? '' : 'pointer-events: none;'}
  
  &:hover {
    transition: background-color 200ms;
    ${props => props.linkTitle ?  `background-color: ${BUTTON_HOVER_BACKGROUND}` : ""}
  }
`
const StyledSmallMenuButton = styled(SmallMenuButton)`
  margin-right: -8px;
`;

const MenuButton = (props) => {
  return (
    <StyledSmallMenuButton mini={true} color={PRIMARY_COLOR} onClick={props.onClick} title="more" path="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></StyledSmallMenuButton>
  );
};

const FeedMenuButton = (props) => {
  const parent = useRef(null)

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

  return (
    <OuterContainer>
      <ButtonContainer clickable={clickable} linkTitle={props.title} displayAbove={false} ref={parent}>
        <MenuButton onClick={toggleAccountMenu}></MenuButton>
      </ButtonContainer>
      {menuDisplayed ? 
      <ButtonPopupMenu tweetData={props.tweetData} hideTweet={props.hideTweet}></ButtonPopupMenu>
      : false}
    </OuterContainer>
  )
}

export default FeedMenuButton