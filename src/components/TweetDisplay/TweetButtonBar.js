import { useEffect } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import styled from "styled-components";
import PubSub from "pubsub-js";
import { UserContext } from "../../App";
import { removeTweetLike, storeTweetLike } from "../../firebase/firestore/like-tweet";
import { BUTTON_GREEN, BUTTON_PINK, PRIMARY_COLOR, SECONDARY_FONT_COLOR } from "../constants";
import { SmallMenuButton } from "../StyledButtons/SmallMenuButton";

const ButtonBarOuter = styled.div`
  width: 100%;
`;
const ButtonBarInner = styled.div`
  max-width: 425px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;
const ButtonContainer = styled.div`
  height: 20px;
  width: max-content;
  display: flex;
  align-items: center;
  color: ${SECONDARY_FONT_COLOR};
  fill: ${SECONDARY_FONT_COLOR};
  background-color: transparent;

  ${props => props.active && `color: ${props.color};`}
  ${props => props.active && `fill: ${props.color};`}

  &:hover {
    color: ${props => props.color};
    fill: ${props => props.color};
  }
`;
const AttributeCount = styled.span`
  font-size: 14px;
  padding: 0px 12px;
  transition: color 200ms ease;
  user-select: none;
`;
const RestyledMenuButton = styled(SmallMenuButton)`
  fill: inherit;
  ${props => props.hovered ? `background-color: ${props.hoverColor};` : 'background-color: transparent;'}
  transition: none;
  transition: fill, background-color, 200ms ease;
  margin: -8px;

  &:hover {
    background-color: ${props => props.hoverColor};
    fill: inherit;
  }
`;
const Button = (props) => {
  const { color, active, onClick, path, title, count } = props
  const [hovered, setHovered] = useState(false);
  const startHover = () => { setHovered(true); };
  const endHover = () => { setHovered(false); };

  const hoverColor = `${props.color.slice(0, -1)}, .15)`;

  return (
    <ButtonContainer active={active} color={color} onMouseOver={startHover} onMouseLeave={endHover} onClick={onClick}>
      <RestyledMenuButton hovered={hovered} hoverColor={hoverColor} mini={true} title={title} path={path} />
      <AttributeCount>{count ? count : ''}</AttributeCount>
    </ButtonContainer>
  );
};

export const TweetButtonBar = ({ tweetData }) => {
  const userContext = useContext(UserContext)
  const { userId } = userContext
  const { likes, tweetId } = tweetData
  
  const [isLiked, setIsliked] = useState(false)
  const [guestLike, setGuestLike] = useState(0)
  
  const likeCountRef = useRef(likes ? Object.keys(likes).length : false)

  useEffect(() => {
    if (likes) {
      if (userContext.guest) { return }
      const keysArray = Object.keys(likes)
      if (keysArray.includes(userId)) {
        setIsliked(true)
      } else {
        setIsliked(false)
      }
    }
  }, [likes, userId, userContext.guest])

  useEffect(() => {
    if (userContext.likes) {
      const likesObject = { ...userContext.likes }
      const keysArray = Object.keys(likesObject)
      if (keysArray.includes(tweetId)) {
        setIsliked(true)
        setGuestLike(1)
      } else {
        setIsliked(false)
        setGuestLike(0)
      }
    }
  }, [tweetId, userContext.likes])

  const toggleTweetLike = async () => {
    try {
      if (isLiked) {
        likeCountRef.current = likeCountRef.current - 1
        setIsliked(false)
        await removeTweetLike(tweetId, userId)
      } else {
        likeCountRef.current = likeCountRef.current + 1
        setIsliked(true)
        await storeTweetLike(tweetId, userId)
      }
    } catch (error) {
      console.error("Failure to change tweet like:", error)
      setTimeout(() => {
        if (isLiked) {
          setIsliked(false)
        } else {
          setIsliked(true)
        }
      }, 500)
    }
  }

  return (
    <ButtonBarOuter>
      <ButtonBarInner>
        <Button color={PRIMARY_COLOR} title="Reply" path="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
        <Button color={BUTTON_GREEN} title="Retweet" path="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
        <Button color={BUTTON_PINK} title="Like" active={isLiked} count={(likeCountRef.current + guestLike)} onClick={toggleTweetLike}
          path={isLiked
          ? "M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
          : "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" } />
        <Button color={PRIMARY_COLOR} title="View" path="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
        <Button color={PRIMARY_COLOR} title="Share" path="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
      </ButtonBarInner>
    </ButtonBarOuter>
  );
};
