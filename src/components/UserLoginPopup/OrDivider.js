import styled from "styled-components";
import { MAIN_FONT_COLOR } from "../constants";
import { DividerLine } from "../styled-components";

const DividerContainer = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  gap: 3px;
  align-items: center;
  margin: 0px -4px;
`;
const DividerLineContainer = styled.div`
  margin: 0px 4px;
  flex-grow: 1;
`;
const OrSpan = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${MAIN_FONT_COLOR};
  margin-top: -2px;
`;
const OrDividerLine = (props) => {

  return (
    <DividerLineContainer>
      <DividerLine></DividerLine>
    </DividerLineContainer>
  );
};
export const OrDivider = (props) => {

  return (
    <DividerContainer>
      <OrDividerLine></OrDividerLine>
      <OrSpan>or</OrSpan>
      <OrDividerLine></OrDividerLine>
    </DividerContainer>
  );
};
