import autoAnimate from "@formkit/auto-animate"
import { onAuthStateChanged } from "firebase/auth"
import { useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import styled from "styled-components"
import { auth } from "../../auth"
import CallToAction from "../CallToAction/CallToAction"
import Header from "../Header/Header"
import PageLayout from "../PageLayout/PageLayout"
import { UserLoginPopup } from "../UserLoginPopup/UserLoginPopup"


const LoginPageContainer = styled.div`
  min-height: 100vh;
`

const LoginPage = (props) => {
  const parent = useRef(null)
  
  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  const navigate = useNavigate()
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) { navigate('/home') }
    })

    return unsubscribe
  }, [navigate])
  
  return (
    <LoginPageContainer ref={parent}>
      <PageLayout userName={null}
                  centerContent={[
        <Header searchBar={true}
                defaultTab="For you"
                tabsArray={["For you", "Trending", "News", "Sports", "Entertainment"]}>
        </Header>
      ]} />
      <UserLoginPopup/>
      <CallToAction></CallToAction>
    </LoginPageContainer>
  )
}

export default LoginPage