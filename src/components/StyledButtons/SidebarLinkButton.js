import styled from "styled-components";
import { MAIN_FONT_COLOR, BUTTON_HOVER_BACKGROUND } from "../constants";
import { TooltipContainer } from "../styled-components";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

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

  @media (min-height: 705px) {
    margin: 4px 0px;
  }
  @media (min-width: 1265px) {
    width: max-content;
  }
`;

const StyledLink = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px;
  text-decoration: none;
`

const StyledSvg = styled.svg`
  fill: ${MAIN_FONT_COLOR};
  height: 26.25px;
  width: 26.25px;
  /* margin-bottom: -4px; */
  opacity: ${props => props.url ? "100%" : "60%"};

  @media (min-width: 1265px) {
    margin-bottom: 0px;
  }
`
const ButtonText = styled.h2`
  color: ${MAIN_FONT_COLOR};
  display: none;
  font-size: 21px;
  font-weight: 400;
  margin: 0px 16px 0px 20px;
  text-decoration: none;

  ${props => props.currentPage && 'font-weight: 700;'}
  opacity: ${props => props.url ? "100%" : "60%"};

  @media (min-width: 1265px) {
    display: block;
  }
`

export const SidebarLinkButton = (props) => {
  const location = useLocation()
  const [current, setCurrent] = useState(false)

  useEffect(() => {
    if (!props.url) { return }

    if (location.pathname === props.url) {
      setCurrent(true)
    } else {
      setCurrent(false)
    }
  }, [location])

  return (
    <ButtonContainer linkTitle={props.title} className={props.className}>
      <StyledLink to={props.url} aria-label={props.title}>
        <StyledSvg viewBox="0 0 24 24" url={props.url}>
          <path d={props.path}></path>
        </StyledSvg>
        <ButtonText currentPage={current} url={props.url}>{props.title}</ButtonText>
      </StyledLink>
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
