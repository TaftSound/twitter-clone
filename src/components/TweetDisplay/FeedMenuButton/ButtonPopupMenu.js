import styled from "styled-components";
import { BACKGROUND_COLOR, SECONDARY_FONT_COLOR, MAIN_FONT_COLOR, BUTTON_HOVER_BACKGROUND, PRIMARY_COLOR } from "../../constants";
import { useContext, useState } from "react";
import { FollowContext, UserContext } from "../../../App";
import { StyledLogo } from "../../styled-components";
import { followUser } from "../../../firebase/firestore/follower-list-functions";
import UnfollowWarning from "../../WarningPopups/UnfollowWarning";
import DeleteWarning from "../../WarningPopups/DeleteWarning";

const RearContainer = styled.div`
  position: absolute;
  top: 5px;
  right: -2.5px;
  background-color: ${BACKGROUND_COLOR};
  box-shadow: 0px 0px 7px 0px rgb(255, 255, 255, 0.4);
  width: 300px;
  border-radius: 15px;
`;
const FrontContainer = styled.div`
  position: relative;
  z-index: 6;
  padding: 12px 0px;
  border-radius: 15px;
  background-color: ${BACKGROUND_COLOR};
`;
const InnerContainer = styled.div`
  box-sizing: border-box;
  width: 300px;
  height: 44px;
  padding: 12px 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  color: ${props => props.inactive ? `${SECONDARY_FONT_COLOR}` : `${MAIN_FONT_COLOR}`};

  &:hover {
    background-color: ${BUTTON_HOVER_BACKGROUND}
  }
`;
const MenuIcon = styled(StyledLogo)`
  height: 18.75px;
  width: 18.75px;
  ${props => props.color ? `fill: ${props.color}` : ''}
`;
const DeleteIcon = () => {
  return <MenuIcon color={PRIMARY_COLOR} path="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 3-2.79L19.93 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.47.93-1 .93H7.86c-.53 0-.96-.41-1-.93L6.07 8h11.85l-.79 11.07zM9 17v-6h2v6H9zm4 0v-6h2v6h-2z" />;
};
const UnfollowIcon = () => {
  return <MenuIcon color={MAIN_FONT_COLOR} path="M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm12.586 3l-2.043-2.04 1.414-1.42L20 7.59l2.043-2.05 1.414 1.42L21.414 9l2.043 2.04-1.414 1.42L20 10.41l-2.043 2.05-1.414-1.42L18.586 9zM3.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C13.318 13.65 11.838 13 10 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C5.627 11.85 7.648 11 10 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H1.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46z" />;
};
const FollowIcon = () => {
  return <MenuIcon color={MAIN_FONT_COLOR} path="M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm13 4v3h2v-3h3V8h-3V5h-2v3h-3v2h3zM3.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C13.318 13.65 11.838 13 10 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C5.627 11.85 7.648 11 10 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H1.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46z" />;
};
const ButtonPopupMenu = (props) => {
  const userData = useContext(UserContext);
  const { following, followers } = useContext(FollowContext)

  const { userId, userName } = props.tweetData;

  const [displayUnfollowWarning, setDisplayUnfollowWarning] = useState(false);
  const [displayDeleteWarning, setDisplayDeleteWarning] = useState(false);

  const followThisUser = async () => {
    try {
      await followUser(userId);
    } catch (error) {
      console.error("Failure to follow user:", error);
      alert("Failure to follow user, fake twitter apologizes for this inconvenience");
    }
  };

  const warnAboutUnfollow = (event) => {
    event.stopPropagation();
    setDisplayUnfollowWarning(true);
  };
  const cancelUnfollow = (event) => {
    setDisplayUnfollowWarning(false);
  };

  const warnAboutDelete = (event) => {
    event.stopPropagation();
    setDisplayDeleteWarning(true);
  };
  const cancelDelete = (event) => {
    setDisplayDeleteWarning(false);
  };

  return (
    <RearContainer>
      <FrontContainer>
        <InnerContainer onClick={userId === userData.userId
          ? warnAboutDelete
          : following.includes(userId)
            ? warnAboutUnfollow
            : followThisUser}>
          {userId === userData.userId ? <DeleteIcon></DeleteIcon>
            : following.includes(userId) ? <UnfollowIcon></UnfollowIcon> : <FollowIcon></FollowIcon>}
          {userId === userData.userId ? 'Delete this tweet'
            : following.includes(userId) ? `Unfollow @${userName}` : `Follow @${userName}`}
        </InnerContainer>
      </FrontContainer>
      {displayUnfollowWarning
        ? <UnfollowWarning userName={props.tweetData.userName}
                           userId={props.tweetData.userId} 
                           cancelFunction={cancelUnfollow} />
        : false}
      {displayDeleteWarning
        ? <DeleteWarning tweetData={props.tweetData}
          followers={followers}
          cancelFunction={cancelDelete}
          hideTweet={props.hideTweet} />
        : false}
    </RearContainer>
  );
};


export default ButtonPopupMenu