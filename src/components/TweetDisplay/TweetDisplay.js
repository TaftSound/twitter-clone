import React from "react";
import PubSub from "pubsub-js";
import { useState } from "react";
import styled from "styled-components"
import { DIVIDER_COLOR_LIGHT } from "../constants";
import { DividerLine } from "../styled-components";
import { TweetButtonBar } from "./TweetButtonBar";

import { TweetHeader } from "./TweetHeader";
import { TweetText } from "./TweetText";
import { TweetUserCircle } from "./TweetUserCircle";
import { LoadingContainer } from "../LoadingPage/LoadingPage";

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

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
  border: solid 1px ${DIVIDER_COLOR_LIGHT};
  border-radius: 16px;
  margin-top: 12px;
  overflow: hidden;
  ${props => !props.imageLoaded && 'height: 380px;'}
`

const Image = styled.img`
  width: 100%;
  ${props => !props.imageLoaded && 'display: none;'}
`

const TweetImage = (props) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const setLoaded = () => {
    setImageLoaded(true)
  }
  
  return (
    <ImageContainer imageLoaded={imageLoaded}>
      {!imageLoaded && <LoadingContainer height="100%"></LoadingContainer>}
      <Image imageLoaded={imageLoaded} onLoad={setLoaded} src={props.src} alt='user uploaded image' className={props.className}></Image>
    </ImageContainer>
  )
}

const TweetDisplay = ({ tweetData }) => {
  const { text, imageUrls } = tweetData
  const [hidden, setHidden] = useState(false)

  const hideTweet = (boolean) => {
    setHidden(boolean)
  }
  if (hidden) { return false }
  return (
    <OuterContainer>
      <PaddingDiv></PaddingDiv>
      <TweetUserCircle tweetData={tweetData}></TweetUserCircle>
      <InnerContainer>
        <TweetHeader tweetData={tweetData} hideTweet={hideTweet}></TweetHeader>
        <TweetText>{text}</TweetText>
        {imageUrls && imageUrls.map((url) => {
          return <TweetImage src={url} key={url} alt='user uploaded image'></TweetImage>
        })}
        <TweetButtonBar tweetData={tweetData}/>
      </InnerContainer>
      <BottomDividerLine></BottomDividerLine>
    </OuterContainer>
  )
}

export default React.memo(TweetDisplay)