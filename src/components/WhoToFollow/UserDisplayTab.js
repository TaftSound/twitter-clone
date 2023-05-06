import styled from "styled-components";
import { MAIN_FONT_COLOR, SECONDARY_FONT_COLOR } from "../constants";
import { UserCircle } from "../styled-components";
import FollowButton from "./FollowButton";

const OuterContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const UserContainer = styled.div`
  flex: auto;
  display: grid;
  grid-template-columns: min-content 1fr;
  width: 100%;
`

const UserInfoContainer = styled.div`
  flex: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  overflow: hidden;
`

const DisplayName = styled.h2`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 21.5px;
  margin: 0px;
  font-weight: 700;
  color: ${MAIN_FONT_COLOR};
  font-size: 16px;
`
const UserName = styled(DisplayName)`
  height: 20px;
  font-weight: 400;
  color: ${SECONDARY_FONT_COLOR};
`

const StyledUserCircle = styled(UserCircle)`
  margin-right: 12px;
`

const UserDisplayTab = (props) => {
  const { userObject } = props
  const userInitial = userObject.displayName[0]

  return (
    <OuterContainer>
      <UserContainer>
        <StyledUserCircle>{userInitial}</StyledUserCircle>
        <UserInfoContainer>
          <DisplayName>{userObject.displayName}</DisplayName>
          <UserName>@{userObject.userName}</UserName>
        </UserInfoContainer>
      </UserContainer>
      <FollowButton userId={userObject.userId} userName={userObject.userName}></FollowButton>
    </OuterContainer>
  )
};

export default UserDisplayTab