import styled from "styled-components";
import { MAIN_FONT_COLOR } from "../constants";

const TweetTextContainer = styled.div`
  width: 100%;
  margin-top: 3px;
`;
const TweetTextSpan = styled.span`
  font-size: 16px;
  color: ${MAIN_FONT_COLOR};
`;
export const TweetText = (props) => {

  return (
    <TweetTextContainer>
      <TweetTextSpan>{props.children}</TweetTextSpan>
    </TweetTextContainer>
  );
};
