import { useLocation } from "react-router-dom"
import styled from "styled-components"
import { NavButtons, TwitterHomeButton } from "./NavButtons"
import NewTweetButton from "../StyledButtons/NewTweetButton"
import UserAccountButton from "./UserAccount"



const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  padding: 0px 4px;

  @media (min-width: 600px) {
    padding: 0px 8px;
    width: 72px;
  }

  @media (min-width: 690px) {
    
  }

  @media (min-width: 992px) {
    
  }

  @media (min-width: 1200px) {
    
  }
`

const LeftSidebar = (props) => {
  const location = useLocation()

  if (location.pathname === '/') {
    return (
      <Container>
        <TwitterHomeButton></TwitterHomeButton>
        <NavButtons loggedIn={false}></NavButtons>
      </Container>
    )
  } else {
    return (
      <Container>
        <TwitterHomeButton></TwitterHomeButton>
        <NavButtons loggedIn={true}></NavButtons>
        <NewTweetButton></NewTweetButton>
        <UserAccountButton></UserAccountButton>
      </Container>
    )
  }
}

export default LeftSidebar