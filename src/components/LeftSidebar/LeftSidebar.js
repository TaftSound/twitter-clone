import { useLocation } from "react-router-dom"
import styled from "styled-components"
import { NavButtons, TwitterHomeButton } from "./NavButtons"
import NewTweetButton from "../StyledButtons/NewTweetButton"
import UserAccountButton from "./UserAccount"



const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 60px;
  padding: 0px 4px;
  min-height: 562px;
  height: 100vh;
  visibility: hidden;
  display: none;

  @media (min-width: 600px) {
    padding: 0px 8px;
    width: 72px;
    visibility: visible;
    display: block;
  }

  @media (min-width: 690px) {
    
  }

  @media (min-width: 988px) {
    padding: 0px 4px;
    width: 60px;
  }

  @media (min-width: 1008px) {
    padding: 0px 8px;
    width: 72px;
  }

  @media (min-width: 1078px) {
    
  }

  @media (min-width: 1200px) {
    
  }
  @media (min-width: 1265px) {
    width: 259px;
  }
`

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 1265px) {
    width: 259px;
    align-items: flex-start;
  }
`

const LeftSidebar = (props) => {
  const location = useLocation()

  if (location.pathname === '/') {
    return (
      <Container>
        <InnerContainer>
          <TwitterHomeButton></TwitterHomeButton>
          <NavButtons loggedIn={false}></NavButtons>
        </InnerContainer>
      </Container>
    )
  } else {
    return (
      <Container>
        <InnerContainer>
          <TwitterHomeButton></TwitterHomeButton>
          <NavButtons loggedIn={true}></NavButtons>
          <NewTweetButton></NewTweetButton>
        </InnerContainer>
        <UserAccountButton></UserAccountButton>
      </Container>
    )
  }
}

export default LeftSidebar