import autoAnimate from "@formkit/auto-animate"
import { useRef, useEffect } from "react"

import styled from "styled-components"
import CallToAction from "../CallToAction/CallToAction"
import { MAIN_FONT_COLOR } from "../constants"
import Header from "../Header/Header"
import PageLayout from "../PageLayout/PageLayout"
import { FlexBox } from "../styled-components"
import { UserLoginPopup } from "../UserLoginPopup/UserLoginPopup"

const H1 = styled.h1`
  color: ${MAIN_FONT_COLOR};
  font-size: 26px;
  font-weight: 900;
  margin: 0px 0px 10px;
`

const H2 = styled.h2`
  color: ${MAIN_FONT_COLOR};
  font-size: 18px;
  margin: 6px 0px;
  font-weight: 500;
`

const P = styled.p`
  color: ${MAIN_FONT_COLOR};
  font-size: 15px;
  margin: 4px 0px;
`
const Strong = styled.strong`
  color: ${MAIN_FONT_COLOR};
  font-size: 15px;
  font-weight: 900;
`

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
                    centerContent={[
                    <FlexBox margin="10px 25px 0px 25px" direction="column">
                      <H1>Welcome to Tweeter!</H1>
                      <H2>Tweeter is a functional clone of Twitter, meticulously crafted 
                      to demonstrate proficiency in modern web development.</H2>
                      <H2>This platform provides a variety of exciting features:</H2>
                      <P>1. <Strong>Create your own user account</Strong> - 
                      Start your journey on Tweeter by making your own unique profile, complete 
                      with bio, profile photo, and banner photo customizations.</P>
                      <P>2. <Strong>Post tweets</Strong> - 
                      Share your thoughts, ideas and photos with the world in real-time just like the real Twitter!</P>
                      <P>3. <Strong>Like tweets</Strong> - 
                      Show your support and interact with other users by liking their tweets.</P>
                      <P>4. <Strong>Infinite scrolling user feed</Strong> - 
                      Engage with an endless feed of tweets. As you scroll down, new tweets continuously 
                      load, providing you with a seamless browsing experience.</P>
                      <P>5. <Strong>Personalized user profile feed</Strong> - 
                      Explore your own tweets and liked tweets in your personal profile page feed. 
                      It’s your own curated corner of the Tweeter universe.</P>
                      {/* <H2>Built for demonstration purposes, this project underscores my ability to 
                      construct an intricate, fully functional web application that balances user 
                      requirements with technical necessities. Please feel free to explore and 
                      interact with the features. Enjoy your time on Tweeter!</H2> */}
                    </FlexBox>
                    ]} />
        <UserLoginPopup/>
        <CallToAction></CallToAction>
      </>
  )
}

export default LoginPage