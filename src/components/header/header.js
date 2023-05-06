import { useState } from "react";
import styled from "styled-components";
import { PRIMARY_COLOR, MAIN_FONT_COLOR, SECONDARY_FONT_COLOR, BUTTON_HOVER_BACKGROUND, DIVIDER_COLOR } from "../constants";
import { SmallMenuButton } from "../StyledButtons/SmallMenuButton";
import PubSub from "pubsub-js";

import PropTypes from 'prop-types';
import uniqid from 'uniqid'

import SearchBar from "../SearchBar/SearchBar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeaderContainerOuter = styled.div`
  position: relative;
  z-index: 25;
  border-bottom: solid 1px ${DIVIDER_COLOR};
  background-color: rgb(0, 0, 0, 0.65);
  backdrop-filter: blur(12px);
`

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

  const changeTab = () => {
    props.setCurrentTab(props.title)
    PubSub.publish('set current tab', props.title)
  }

  return (
    <NavButtonOuter data-testid={props.title} role="button" onClick={changeTab} >
      <NavButtonInner tabMargin={props.tabMargin}>
        { props.currentTab === props.title 
            ? <H2 $focused data-testid="focused-tab">{props.title}</H2>
            : <H2>{props.title}</H2> }
        { props.currentTab === props.title
            ? <ButtonUnderline data-testid="underline"></ButtonUnderline> 
            : false }
      </NavButtonInner>
    </NavButtonOuter>
  )
}

NavButton.propTypes = {
  title: PropTypes.string.isRequired,
  currentTab: PropTypes.string.isRequired,
  setCurrentTab: PropTypes.func.isRequired
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
  padding: 0px;
  font-size: 21px;
  color: ${MAIN_FONT_COLOR};
`
const SearchBarSettingsContainer = styled.div`
  height: 53px;
  width: 65px;
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  margin-right: -9px;
`

const displayLogin = () => {
  PubSub.publish('login user')
}


const Header = (props) => {

  const [currentTab, setCurrentTab] = useState(props.defaultTab)

  return (
    <HeaderContainerOuter data-testid="home-header" className={props.className}>
      {props.titleHeader ? <HeaderContainer><H1>{props.titleHeader}</H1></HeaderContainer> : false }
      {props.searchBar
        ? <HeaderContainer>
            <SearchBar></SearchBar>
            <SearchBarSettingsContainer>
              <SmallMenuButton onClick={displayLogin} title="Settings" path="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z" />
            </SearchBarSettingsContainer>
          </HeaderContainer>
        : false }
      <TabContainer columns={props.tabsArray.length}>
        {props.tabsArray.map((tab) => {
          return <NavButton title={tab} 
                            key={uniqid()} 
                            currentTab={currentTab} 
                            setCurrentTab={setCurrentTab} />
        })}
      </TabContainer>
    </HeaderContainerOuter>
  )
}

const ProfileH1Container = styled.div`
  padding: 2px 0px;
  margin-top: -2px;
`
const TweetCount = styled.p`
  color: ${SECONDARY_FONT_COLOR};
  font-size: 14px;
  margin: 0px;
`
const BackButtonContainer = styled.div`
  width: 56px;
`
const BackButton = styled(SmallMenuButton)`
  margin-left: -7px;
`

export const ProfileHeader = (props) => {
  const navigate = useNavigate()
  const [tweetCount, setTweetCount] = useState(0)

  const navigateBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    const unsubToken = PubSub.subscribe('set user tweet count', (msg, count) => {
      setTweetCount(count)
    })

    return () => {
      PubSub.unsubscribe(unsubToken)
    }
  }, [])

  return (
    <HeaderContainerOuter className={props.className}>
      <HeaderContainer>
        <BackButtonContainer>
          <BackButton onClick={navigateBack} title="Back" path="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
        </BackButtonContainer>
        <div>
          <ProfileH1Container>
            <H1>{props.titleHeader}</H1>
          </ProfileH1Container>
          <TweetCount>{tweetCount} Tweets</TweetCount>
        </div>
      </HeaderContainer>
    </HeaderContainerOuter>
  )
}

export default Header
