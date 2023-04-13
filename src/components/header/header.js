import { useState } from "react";
import styled from "styled-components";
import { PRIMARY_COLOR, MAIN_FONT_COLOR, SECONDARY_FONT_COLOR, BUTTON_HOVER_BACKGROUND } from "../constants";

import PropTypes from 'prop-types';
import uniqid from 'uniqid'

import SearchBar from "../SearchBar/SearchBar";

const NavButtonOuter = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color;
  transition-duration: 200ms;
  padding: 0px 16px;

  &:hover {
    background-color: ${BUTTON_HOVER_BACKGROUND};
  }
`
const NavButtonInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`
const H2 = styled.h2`
  font-size: 16px;
  font-weight: ${props => props.$focused ? 700 : 500 };
  width: max-content;
  margin: 0px;
  padding: 16px 2px;
  user-select: none;
  color: ${props => props.$focused ? MAIN_FONT_COLOR : SECONDARY_FONT_COLOR};
`
const ButtonUnderline = styled.div`
  position: absolute;
  width: 100%;
  background-color: ${PRIMARY_COLOR};
  height: 4px;
  border-radius: 10px;
  position: absolute;
  bottom: 0px;
`

function NavButton(props) {
  return (
    <NavButtonOuter data-testid={props.title} role="button" onClick={() => props.setCurrentViewState(props.title)} >
      <NavButtonInner tabMargin={props.tabMargin}>
        { props.currentViewState === props.title 
            ? <H2 $focused data-testid="focused-tab">{props.title}</H2>
            : <H2>{props.title}</H2> }
        { props.currentViewState === props.title
            ? <ButtonUnderline data-testid="underline"></ButtonUnderline> 
            : false }
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
  display: flex;
  align-items: center;
  height: 53px;
  padding: 0px 16px;
`
const TabContainer = styled.div`
  height: 53px;
  display: flex;
`
const H1 = styled.h1`
  margin: 0px;
  padding: 0px 16px;
  font-size: 21px;
  color: ${MAIN_FONT_COLOR};
`

const Header = (props) => {

  const [currentViewState, setCurrentViewState] = useState(props.defaultTab)

  return (
    <div data-testid="home-header">
      {props.titleHeader ? <HeaderContainer><H1>{props.titleHeader}</H1></HeaderContainer> : false }
      {props.searchBar ? <HeaderContainer><SearchBar></SearchBar></HeaderContainer>: false }
      <TabContainer columns={props.tabsArray.length}>
        {props.tabsArray.map((tab) => {
          return <NavButton title={tab} 
                            key={uniqid()} 
                            currentViewState={currentViewState} 
                            setCurrentViewState={setCurrentViewState} />
        })}
      </TabContainer>
    </div>
  )
}

export default Header
