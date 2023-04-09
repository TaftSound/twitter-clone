import styled from "styled-components"
import { NavButtons, TwitterHomeButton } from "./nav-buttons"
import NewTweetButton from "./new-tweet-button"



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

  return (
    <Container>
      <TwitterHomeButton></TwitterHomeButton>
      <NavButtons></NavButtons>
      <NewTweetButton></NewTweetButton>
    </Container>
  )
}

export default LeftSidebar