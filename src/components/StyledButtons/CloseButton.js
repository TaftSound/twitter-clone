import styled from "styled-components";
import { MAIN_FONT_COLOR, BUTTON_HOVER_BACKGROUND } from "../constants";
import { TooltipContainer, StyledLogo } from "../styled-components";


export const CloseButtonContainer = styled(TooltipContainer)`
  height: 34px;
  width: 34px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 200ms;
  cursor: pointer;

  &:hover {
    background-color: ${BUTTON_HOVER_BACKGROUND};
  }
`;
const StyledButton = styled(StyledLogo)`
  height: 20px;
  width: 20px;
  fill: ${MAIN_FONT_COLOR};
`;
export const CloseButton = (props) => {
  return (
    <CloseButtonContainer onClick={props.onClick} linkTitle="Close">
      <StyledButton path="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z" />
    </CloseButtonContainer>
  );
};
