import styled from "styled-components";
import { MAIN_FONT_COLOR, BUTTON_HOVER_BACKGROUND, SECONDARY_FONT_COLOR, PRIMARY_COLOR } from "../constants";
import { TooltipContainer } from "../styled-components";

const SmallButtonContainer = styled(TooltipContainer)`
  height: 34px;
  width: 34px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color, fill, 200ms;
  cursor: pointer;
  fill: ${MAIN_FONT_COLOR};
  ${props => props.color? `fill: ${SECONDARY_FONT_COLOR};` : ''}

  &:hover {
    background-color: ${BUTTON_HOVER_BACKGROUND};
    ${props => props.color? `fill: ${props.color};` : ''}
    ${props => props.hoverColor? `background-color: ${props.hoverColor};` : ''}
  }
`

const StyledSvg = styled.svg`
  height: ${props => props.miniture? '18.75px' : '20px'};
  width: ${props => props.miniture? '18.75px' : '20px'};
  margin-bottom: ${props => props.miniture? '-3px' : '-4px'};
`

export const SmallMenuButton = (props) => {
  let hoverColor = null
  if (props.color) { hoverColor = `${props.color.slice(0, -1)}, .1)` }
  console.log(hoverColor)

  return (
    <SmallButtonContainer color={props.color} hoverColor={hoverColor} linkTitle={props.title} onClick={props.onClick}>
      <a href={props.url} aria-label={props.title} name={props.title}>
        <StyledSvg miniture={props.mini} viewBox="0 0 24 24">
          <path d={props.path}></path>
        </StyledSvg>
      </a>
    </SmallButtonContainer>
  );
};
