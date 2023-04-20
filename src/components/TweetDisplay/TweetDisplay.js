import styled from "styled-components"
import { TweetButtonBar } from "./TweetButtonBar";

import { TweetHeader } from "./TweetHeader";
import { TweetText } from "./TweetText";
import { TweetUserCircle } from "./TweetUserCircle";

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
const InnerContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 0px 0px 12px;
  overflow: visible;
`

const TweetDisplay = ({ userData, tweetData }) => {
  const { timestamp, text, likes } = tweetData
  const { userName, displayName } = userData
  return (
    <OuterContainer>
      <PaddingDiv></PaddingDiv>
      <TweetUserCircle>{displayName[0]}</TweetUserCircle>
      <InnerContainer>
        <TweetHeader userName={userName} displayName={displayName} timestamp={timestamp}></TweetHeader>
        <TweetText>{text}</TweetText>
        <TweetButtonBar likes={likes}/>
      </InnerContainer>
    </OuterContainer>
  )
}

export default TweetDisplay