import styled from "styled-components"
import { PRIMARY_COLOR, SECONDARY_FONT_COLOR } from "../constants";

import { UserCircle } from "../styled-components";
import { SmallMenuButton } from "../StyledButtons/SmallMenuButton";

const OuterContainer = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: min-content 1fr;
  padding: 0px 16px;
  overflow: visible;
`
const PaddingDiv = styled.div`
  grid-column: 1 / -1;
  padding: 12px 0px 0px;
`
const UserAccountContainer = styled.div`
  width: min-content;
  position: relative;
  height: 100%;
  margin: 0px 12px 0px 0px;
  padding: 4px 0px 0px;
  overflow: visible;
`
const InnerContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 0px 0px 12px;
  overflow: visible;
`

const TweetHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const TweetInfoContainer = styled.div`

`


const FeedMenuButton = (props) => {
  return (
    <SmallMenuButton mini={true} color={PRIMARY_COLOR} onClick={props.onClick} linkTitle="more" path="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></SmallMenuButton>
  )
}
const TweetHeader = (props) => {

  return (
    <TweetHeaderContainer>
      <FeedMenuButton></FeedMenuButton>
    </TweetHeaderContainer>
  )
}

const TweetDisplay = (props) => {

  return (
    <OuterContainer>
      <PaddingDiv></PaddingDiv>
      <UserAccountContainer>
        <UserCircle></UserCircle>
      </UserAccountContainer>
      <InnerContainer>
        <TweetHeader></TweetHeader>
      </InnerContainer>
    </OuterContainer>
  )
}

export default TweetDisplay