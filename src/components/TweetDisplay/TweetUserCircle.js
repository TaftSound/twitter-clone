import styled from "styled-components";
import { UserCircle } from "../styled-components";

const UserAccountContainer = styled.div`
  width: min-content;
  position: relative;
  height: 100%;
  margin: 0px 12px 0px 0px;
  padding: 4px 0px 0px;
  overflow: visible;
`;
export const TweetUserCircle = (props) => {
  const { tweetData } = props
  return (
    <UserAccountContainer>
      <UserCircle userData={tweetData} ></UserCircle>
    </UserAccountContainer>
  );
};
