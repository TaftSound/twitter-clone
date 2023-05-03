import React from "react";
import { useState } from "react";
import styled from "styled-components"
import { DIVIDER_COLOR_LIGHT } from "../constants";
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
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
`

const TweetImage = styled.img`
  max-width: 100%;
  border: solid 1px ${DIVIDER_COLOR_LIGHT};
  border-radius: 16px;
  margin-top: 12px;
`

const TweetDisplay = ({ tweetData }) => {
  const { text, likes, imageUrls, displayName, } = tweetData
  const [hidden, setHidden] = useState(false)

  const hideTweet = (boolean) => {
    setHidden(boolean)
  }

  if (hidden) { return false }
  return (
    <OuterContainer>
      <PaddingDiv></PaddingDiv>
      <TweetUserCircle>{displayName[0]}</TweetUserCircle>
      <InnerContainer>
        <TweetHeader tweetData={tweetData} hideTweet={hideTweet}></TweetHeader>
        <TweetText>{text}</TweetText>
        {imageUrls && imageUrls.map((url) => {
          return <TweetImage src={url} key={url} alt='user uploaded image'></TweetImage>
        })}
        <TweetButtonBar likes={likes}/>
      </InnerContainer>
      <BottomDividerLine></BottomDividerLine>
    </OuterContainer>
  )
}

export default React.memo(TweetDisplay)