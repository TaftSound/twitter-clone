import { useState } from "react";
import styled from "styled-components";
import { PRIMARY_COLOR, MAIN_FONT_COLOR, SECONDARY_FONT_COLOR, BUTTON_HOVER_BACKGROUND } from "../constants";

import PropTypes from 'prop-types';

const NavButtonOuter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color;
  transition-duration: 200ms;

  &:hover {
    background-color: ${BUTTON_HOVER_BACKGROUND};
  }
`
const NavButtonInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  position: relative;
`
const H2 = styled.h2`
  font-size: 15px;
  font-weight: ${props => props.$focused ? 700 : 500 };
  margin: 0px;
  padding: 16px 0px;
  user-select: none;
  color: ${props => props.$focused ? MAIN_FONT_COLOR : SECONDARY_FONT_COLOR};
`
const ButtonUnderline = styled.div`
  width: 100%;
  background-color: ${PRIMARY_COLOR};
  height: 4px;
  border-radius: 10px;
  position: absolute;
  bottom: -1px;
`

function NavButton(props) {
  return (
    <NavButtonOuter data-testid={props.title} role="button" onClick={() => props.setCurrentViewState(props.title)} >
      <NavButtonInner>
        {props.currentViewState === props.title ? <H2 $focused>{props.title}</H2> : <H2>{props.title}</H2>}
        {props.currentViewState === props.title ? <ButtonUnderline data-testid="underline"></ButtonUnderline> : false}
      </NavButtonInner>
    </NavButtonOuter>
  )
}

NavButton.propTypes = {
  title: PropTypes.string.isRequired,
  currentViewState: PropTypes.string.isRequired,
  setCurrentViewState: PropTypes.func.isRequired
}

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  height: 53px;
`
const H1 = styled.h1`
  margin: 0px;
  padding: 0px 16px;
  font-size: 20px;
  color: ${MAIN_FONT_COLOR};
`

const Header = (props) => {

  const [currentViewState, setCurrentViewState] = useState('For you')

  return (
    <div className="home-header" data-testid="home-header">
      <HeaderContainer>
        <H1>Home</H1>
      </HeaderContainer>
      <HeaderContainer>
        <NavButton title="For you" currentViewState={currentViewState} setCurrentViewState={setCurrentViewState}/>
        <NavButton title="Following" currentViewState={currentViewState} setCurrentViewState={setCurrentViewState}/>
      </HeaderContainer>
    </div>
  )
}

export default Header
