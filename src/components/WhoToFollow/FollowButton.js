import styled from "styled-components";

import { FormButton } from "../StyledButtons/FormButton";
import { useState } from "react";
import { ALERT_RED, ALERT_RED_DARK, ALERT_RED_TRANSPARENT, BUTTON_BORDER_COLOR, MAIN_FONT_COLOR, WHO_TO_FOLLOW_BACKGROUND } from "../constants";

const OuterContainer = styled.div`
  margin-left: 12px;
  justify-self: flex-end;
`
const FormButtonWrapper = styled.div`
  border-radius: 1000px;
  height: min-content;
`
const StyledFormButton = styled(FormButton)`
  font-size: 15px;
  height: 32px;
  margin: 0px;
  transition: background-color, color, border-color, ease-out 150ms;

  ${props => props.unfollowColors ? `background-color: ${WHO_TO_FOLLOW_BACKGROUND};` : ''}
  ${props => props.unfollowColors ? `border-color: ${BUTTON_BORDER_COLOR};` : ''}
  ${props => props.unfollowColors ? `color: ${MAIN_FONT_COLOR};` : ''}
  ${props => props.unfollowColors ? `width: 101px;` : ''}
  
  ${props => props.unfollowColors ? `` : ''}

  &:hover {
    ${props => props.unfollowColors ? `color: ${ALERT_RED};` : ''}
    ${props => props.unfollowColors ? `border-color: ${ALERT_RED_DARK};` : ''}
    ${props => props.unfollowColors ? `background-color: ${ALERT_RED_TRANSPARENT};` : ''}
  }
`

const FollowButton = (props) => {
  const [isFollowed, setIsFollowed] = useState(false)
  const [displayUnfollowButton, setDisplayUnfollowButton] = useState(false)
  const [buttonText, setButtonText] = useState('Follow')

  const toggleFollow = () => {
    if (isFollowed) {
      // display popup to confirm unfollow
      // call firestore function to unfollow user
      setIsFollowed(false)
      setDisplayUnfollowButton(false)
      setButtonText('Follow')
    } else {
      // call firestore function to follow user
      setIsFollowed(true)
      setButtonText('Following')
    }
  }
  const mouseLeave = () => {
    if (isFollowed && !displayUnfollowButton) {
      console.log('schmoop')
      setDisplayUnfollowButton(true)
    }
    if (isFollowed && buttonText === 'Unfollow') {
      setButtonText('Following')
    }
  }

  const mouseOver = () => {
    if (isFollowed) {
      setButtonText('Unfollow')
    }
  }


  return (
    <OuterContainer>
      <FormButtonWrapper onClick={toggleFollow} onMouseLeave={mouseLeave} onMouseEnter={mouseOver}>
        <StyledFormButton small={true} unfollowColors={displayUnfollowButton}>
            {buttonText}
        </StyledFormButton>
      </FormButtonWrapper>
    </OuterContainer>  
  )
};

export default FollowButton