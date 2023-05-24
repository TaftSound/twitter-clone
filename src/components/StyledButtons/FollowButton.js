import styled from "styled-components";
import PubSub from "pubsub-js";

import { FormButton } from "./FormButton";
import UnfollowWarning from "../WarningPopups/UnfollowWarning"

import { ALERT_RED, ALERT_RED_DARK, ALERT_RED_TRANSPARENT, BUTTON_BORDER_COLOR, MAIN_FONT_COLOR, WHO_TO_FOLLOW_BACKGROUND } from "../constants";
import { followUser, unfollowUser } from "../../firebase/firestore/follower-list-functions";
import { FollowContext, UserContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { useRef } from "react";

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
  ${props => props.profile ? `height: 34px;` : ''}
  ${props => props.profile ? `box-sizing: content-box;` : ''}
  margin: 0px;
  transition: background-color, color, border-color, ease-out 100ms;

  ${props => props.unfollowColors ? `background-color: transparent;` : ''}
  ${props => props.unfollowColors ? `border-color: ${BUTTON_BORDER_COLOR};` : ''}
  ${props => props.unfollowColors ? `color: ${MAIN_FONT_COLOR};` : ''}
  ${props => props.unfollowColors ? `width: 70px;` : ''}
  
  ${props => props.unfollowColors ? `` : ''}

  &:hover {
    ${props => props.unfollowColors ? `color: ${ALERT_RED};` : ''}
    ${props => props.unfollowColors ? `border-color: ${ALERT_RED_DARK};` : ''}
    ${props => props.unfollowColors ? `background-color: ${ALERT_RED_TRANSPARENT};` : ''}
  }
`


const FollowButton = ({ userId, userName, profile}) => {
  const [isFollowed, setIsFollowed] = useState(false)
  const [displayUnfollowButton, setDisplayUnfollowButton] = useState(false)
  const [displayUnfollowWarning, setDisplayUnfollowWarning] = useState(false)
  const [buttonText, setButtonText] = useState('Follow')

  const userContext = useContext(UserContext)
  const followContext = useContext(FollowContext)

  const isFollowedRef = useRef(isFollowed)

  useEffect(() => {
    isFollowedRef.current = isFollowed
  }, [isFollowed])

  const followThisUser = async (userIdToFollow) => {
    try {
      setIsFollowed(true)
      setButtonText('Following')
      await followUser(userIdToFollow)
      if (userContext.guest) {
        const followingDataArray = [...followContext.following]
        followingDataArray.push(userIdToFollow)
        PubSub.publish('update follow list', { following: followingDataArray })
      }
    } catch (error) {
      console.log("Follow button failure:", error)
      setIsFollowed(false)
      setDisplayUnfollowButton(false)
      setButtonText('Follow')
      alert("Something has gone wrong, fake twitter apologizes for the inconvenience")
    }
  }

  const unfollowThisUser = async () => {
    try {
      setIsFollowed(false)
      setDisplayUnfollowButton(false)
      setButtonText('Follow')
      await unfollowUser(userId)
      if (userContext.guest) {
        const followingDataArray = [...followContext.following]
        const userToRemove = userId
        const updatedfollowingArray = followingDataArray.filter(user => user !== userToRemove)
        PubSub.publish('update follow list', { following: updatedfollowingArray })
      }
    } catch (error) {
      console.log("Follow button failure:", error)
      setIsFollowed(true)
      setButtonText('Following')
      alert("Something has gone wrong, fake twitter apologizes for the inconvenience")
    }
  }

  const warnAboutUnfollow = () => {
    setDisplayUnfollowWarning(true)
  }
  const hidePopup = () => {
    setDisplayUnfollowWarning(false)
  }

  const toggleFollow = async () => {
    if (isFollowed) {
      // display popup to confirm unfollow
      warnAboutUnfollow()
    } else {
      // call firestore function to follow user
      await followThisUser(userId)
    }
  }
  
  useEffect(() => {
    if (followContext.following.includes(userId)) {
      if (!isFollowedRef.current) {
        setDisplayUnfollowButton(true)
        setButtonText('Following')
        setIsFollowed(true)
      }
    } else {
      if (isFollowedRef.current) {
        setIsFollowed(false)
        setDisplayUnfollowButton(false)
        setButtonText('Follow')
      }
    }
  }, [followContext, userId])

  const mouseLeave = () => {
    if (isFollowed && !displayUnfollowButton) {
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
    <>
    <OuterContainer>
      <FormButtonWrapper onClick={toggleFollow} onMouseLeave={mouseLeave} onMouseEnter={mouseOver}>
        <StyledFormButton small={true} profile={profile} unfollowColors={displayUnfollowButton}>
            {buttonText}
        </StyledFormButton>
      </FormButtonWrapper>
    </OuterContainer>
    {displayUnfollowWarning 
      ? <UnfollowWarning userName={userName} 
                         confirmFunction={unfollowThisUser}
                         cancelFunction={hidePopup}
                         hideFunction={hidePopup}/> 
      : ''}
    </>
  )
};

export default FollowButton
