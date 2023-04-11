import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { PRIMARY_COLOR, MAIN_FONT_COLOR, SECONDARY_FONT_COLOR, BUTTON_HOVER_BACKGROUND } from "../constants";

import PropTypes from 'prop-types';
import uniqid from 'uniqid'

import SearchBar from "../SearchBar/SearchBar";

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
  position: relative;
`
const H2 = styled.h2`
  font-size: 15px;
  font-weight: ${props => props.$focused ? 700 : 500 };
  width: max-content;
  margin: 0px;
  padding: ${props => `16px ${props.paddingIncrease + 16}px` };
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
        { props.currentViewState === props.title 
            ? <H2 $focused data-testid="focused-tab" paddingIncrease={props.paddingIncrease} >{props.title}</H2>
            : <H2 paddingIncrease={props.paddingIncrease} >{props.title}</H2> }
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
  
`

const HeaderSubContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0px, 1fr));
  grid-auto-columns: 1fr;
  align-items: center;
  height: 53px;
`
const TabContainer = styled(HeaderSubContainer)`
  grid-template-columns: ${props => `repeat(${props.columns}, max-content)`};
  grid-auto-columns: max-content;
  width: max-content;
`
const H1 = styled.h1`
  margin: 0px;
  padding: 0px 16px;
  font-size: 21px;
  color: ${MAIN_FONT_COLOR};
`

const Header = (props) => {

  const [currentViewState, setCurrentViewState] = useState(props.defaultTab)
  const [paddingIncrease, setPaddingIncrease] = useState(0)
  const headerContainerRef = useRef(null)
  const tabContainerRef = useRef(null)

  useEffect(() => {
    const headerComponent = headerContainerRef.current
    const tabContainerComponent = tabContainerRef.current
    if (headerComponent) {
      const missingWidth = headerComponent.scrollWidth - tabContainerComponent.scrollWidth
      const newPaddingIncrease = (missingWidth / props.tabsArray.length) / 2
      setPaddingIncrease(+newPaddingIncrease)
    }
  }, [props.tabsArray])

  return (
    <HeaderContainer className="home-header" data-testid="home-header" ref={headerContainerRef}>
      {props.titleHeader ? <HeaderSubContainer><H1>{props.titleHeader}</H1></HeaderSubContainer> : false }
      {props.searchBar ? <HeaderSubContainer><SearchBar></SearchBar></HeaderSubContainer>: false }
      <TabContainer ref={tabContainerRef} columns={props.tabsArray.length} >
        {props.tabsArray.map((tab) => {
          return <NavButton title={tab} 
                            key={uniqid()} 
                            currentViewState={currentViewState} 
                            setCurrentViewState={setCurrentViewState}
                            paddingIncrease={paddingIncrease} />
        })}
      </TabContainer>
    </HeaderContainer>
  )
}

export default Header
