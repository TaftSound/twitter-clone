import { useEffect, useState } from "react";
import styled from "styled-components"
import { checkIfFollowing } from "../../firestore/follower-list-functions";
import { DividerLine } from "../styled-components";
import { TweetButtonBar } from "./TweetButtonBar";

import { TweetHeader } from "./TweetHeader";
import { TweetText } from "./TweetText";
import { TweetUserCircle } from "./TweetUserCircle";

const OuterContainer = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: min-content 1fr;
  padding: 0px 16px;
  box-sizing: border-box;
  overflow: visible;
`
const PaddingDiv = styled.div`
  grid-column: 1 / -1;
  padding: 12px 0px 0px;
`
const InnerContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 0px 0px 12px;
  overflow: visible;
`

const BottomDividerLine = styled(DividerLine)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

const TweetDisplay = ({ tweetData }) => {
  const { timestamp, text, likes, userName, displayName, userId, tweetId } = tweetData

  return (
    <OuterContainer>
      <PaddingDiv></PaddingDiv>
      <TweetUserCircle>{displayName[0]}</TweetUserCircle>
      <InnerContainer>
        <TweetHeader tweetData={tweetData} ></TweetHeader>
        <TweetText>{text}</TweetText>
        <TweetButtonBar likes={likes}/>
      </InnerContainer>
      <BottomDividerLine></BottomDividerLine>
    </OuterContainer>
  )
}

export default TweetDisplay