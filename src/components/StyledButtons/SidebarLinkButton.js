import styled from "styled-components";
import { MAIN_FONT_COLOR, BUTTON_HOVER_BACKGROUND } from "../constants";
import { TooltipContainer } from "../styled-components";
import { Link } from "react-router-dom";

const ButtonContainer = styled(TooltipContainer)`
  height: 50.25px;
  width: 50.25px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 200ms;

  &:hover {
    background-color: ${BUTTON_HOVER_BACKGROUND};
  }
`;

const StyledSvg = styled.svg`
  fill: ${MAIN_FONT_COLOR};
  height: 26.25px;
  width: 26.25px;
  margin-bottom: -4px;
  padding: 12px;
  opacity: ${props => props.url ? "100%" : "60%"};
`

export const SidebarLinkButton = (props) => {
  return (
    <ButtonContainer linkTitle={props.title} className={props.className}>
      <Link to={props.url} aria-label={props.title}>
        <StyledSvg viewBox="0 0 24 24" url={props.url}>
          <path d={props.path}></path>
        </StyledSvg>
      </Link>
    </ButtonContainer>
  );
}

const LogoSvg = styled.svg`
  fill: ${MAIN_FONT_COLOR};
  height: 30px;
  width: 50px;
  margin-bottom: -4px;
  padding: 0px;
  opacity: 95%;
`

export const SidebarTwitterButton = (props) => {
  return (
    <ButtonContainer linkTitle={props.title} className={props.className}>
      <Link to={props.url} aria-label={props.title}>
        <LogoSvg viewBox="0 0 24 24" url={props.url}>
          <path d={props.path}></path>
        </LogoSvg>
      </Link>
    </ButtonContainer>
  );
}
