import styled from "styled-components";
import { MAIN_FONT_COLOR, SECONDARY_FONT_COLOR } from "../constants";
import FeedMenuButton from './FeedMenuButton'

const TweetHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
`;
const TweetInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const MainHeader = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${MAIN_FONT_COLOR};
  margin: 0px;
`;
const SecondaryHeader = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: ${SECONDARY_FONT_COLOR};
  margin: 0px;
`;
const DotDivider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  background-color: ${SECONDARY_FONT_COLOR};
  height: 2px;
  width: 2px;
  border-radius: 1000px;
  margin: 0px 1px;
  transform: translateY(60%);
`;

export const TweetHeader = (props) => {
  const { displayName, userName, timestamp } = props.tweetData
  const secondsElapsed = (Date.now() - timestamp) / 1000;

  const timeSinceTweet = secondsElapsed < 3600
    ? `${Math.floor(secondsElapsed / 60)}min`
    : secondsElapsed < 86400
    ? `${Math.floor(secondsElapsed / 3600)}h`
    : (() => {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })()

  return (
    <TweetHeaderContainer>
      <TweetInfoContainer>
        <MainHeader>{displayName}</MainHeader>
        <SecondaryHeader>@{userName}</SecondaryHeader>
        <DotDivider></DotDivider>
        <SecondaryHeader>{timeSinceTweet}</SecondaryHeader>
      </TweetInfoContainer>
      <FeedMenuButton tweetData={props.tweetData} hideTweet={props.hideTweet}></FeedMenuButton>
    </TweetHeaderContainer>
  );
};
