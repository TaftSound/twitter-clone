import { DividerLine, StyledLogo } from "../styled-components";
import styled from "styled-components";
import { FONT_FAMILY, PRIMARY_COLOR } from "../constants";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 0px 0px -8px;
`;
const InnerContainer = styled.div`
  height: 22px;
  display: flex;
  padding: 0px 12px 12px;
  border: solid 1px transparent;
`;
const SvgContainer = styled.div`
  margin: 0px 4px 0px 0px;
  display: flex;
  align-items: center;
`;
const Button = styled.button`
  border-radius: 25px;
  padding: 0px;
  color: ${PRIMARY_COLOR};
  background-color: transparent;
  border: none;
  font-size: 14px;
  font-family: ${FONT_FAMILY};
  font-weight: 700;
`;

export const WhoCanReply = (props) => {
  if (!props.expanded) { return false }
  return (
    <Container data-testid="who-can-reply">
      <InnerContainer>
        <SvgContainer>
          <StyledLogo path="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-.25 10.48L10.5 17.5l-2-1.5v-3.5L7.5 9 5.03 7.59c1.42-2.24 3.89-3.75 6.72-3.84L11 6l-2 .5L8.5 9l5 1.5-1.75 1.73zM17 14v-3l-1.5-3 2.88-1.23c1.17 1.42 1.87 3.24 1.87 5.23 0 1.3-.3 2.52-.83 3.61L17 14z"/>
        </SvgContainer>
        <Button type="button">Everyone can reply</Button>
      </InnerContainer>
      <DividerLine></DividerLine>
    </Container>
  );
};
