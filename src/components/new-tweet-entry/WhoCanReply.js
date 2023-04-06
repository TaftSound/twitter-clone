import { DividerLine } from "../styled-components";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 0px 0px -8px;
`;
const InnerContainer = styled.div`
  display: flex;
  padding: 0px 12px 12px;
`;
const Svg = styled.svg`
  margin: 0px 4px 0px 0px;
`;
const Button = styled.button`
  border-radius: 25px;
  padding: 5px 10px;
  color: blue;
`;

export const WhoCanReply = (props) => {
  return (
    <Container data-testid="who-can-reply">
      <InnerContainer>
        <Svg></Svg>
        <Button type="button">Everyone can reply</Button>
      </InnerContainer>
      <DividerLine></DividerLine>
    </Container>
  );
};
