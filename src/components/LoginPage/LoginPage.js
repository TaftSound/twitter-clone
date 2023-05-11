import autoAnimate from "@formkit/auto-animate"
import { useRef, useEffect } from "react"

import styled from "styled-components"
import CallToAction from "../CallToAction/CallToAction"
import Header from "../Header/Header"
import PageLayout from "../PageLayout/PageLayout"
import { UserLoginPopup } from "../UserLoginPopup/UserLoginPopup"


const LoginPage = (props) => {
  const parent = useRef(null)
  
  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])
  
  return (
      <>
        <PageLayout userName={null}
                    header={<Header searchBar={true}
                              defaultTab="For you"
                              tabsArray={["For you", "Trending", "News", "Sports", "Entertainment"]}>
                            </Header>}
                    centerContent={[<div></div>]} />
        <UserLoginPopup/>
        <CallToAction></CallToAction>
      </>
  )
}

export default LoginPage