import styled from "styled-components"
import CallToAction from "../CallToAction/CallToAction"

import Header from "../Header/Header"
import PageLayout from "../PageLayout/PageLayout"
import { UserLoginPopup, UserSignupPopup } from "../UserLoginPopup/UserLoginPopup"


const LoginPageContainer = styled.div`
  min-height: 100vh;
`

const LoginPage = (props) => {

  return (
    <LoginPageContainer>
      <PageLayout userName={null}
                  centerContent={[
        <Header searchBar={true}
                defaultTab="For you"
                tabsArray={["For you", "Trending", "News", "Sports", "Entertainment"]}>
        </Header>
      ]} />
      <UserLoginPopup/>
      <UserSignupPopup/>
      <CallToAction></CallToAction>
    </LoginPageContainer>
  )
}

export default LoginPage