import styled from "styled-components";
import { InputButton } from "./InputButton";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;
const InputButtonContainer = styled.div`
  display: flex;
  margin: 12px 0px 0px;
`;
const TweetButtonContainer = styled.div`
  margin: 12px 0px 0px 12px;
`;
const TweetButton = styled.button`
  background-color: blue;
  color: white;
  box-sizing: border-box;
  height: 34px;
  padding: 0px 16px;
  border-radius: 25px;
`;

export const ButtonBar = (props) => {

  return (
    <Container>
      <InputButtonContainer>
        {/* <InputButton /> */}
      </InputButtonContainer>
      <TweetButtonContainer>
        <TweetButton onClick={props.submitTweet} data-testid="submit-tweet">Tweet</TweetButton>
      </TweetButtonContainer>
    </Container>
  );
};
