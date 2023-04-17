import styled from "styled-components"
import { useEffect, useState, useRef } from "react"
import PubSub from "pubsub-js"
import autoAnimate from "@formkit/auto-animate"

import { MAIN_FONT_COLOR, PRIMARY_COLOR, SECONDARY_FONT_COLOR } from "../constants"

import PopupModal from "../PopupModal/PopupModal"
import { FormButton } from "../FormButton"
import { OrDivider } from "./OrDivider"
import { UserNameInput } from "./UserNameInput"

import { anonymousGuestSignin, googlePopupSignin, googlePopupSignup  } from "../../auth"
import { checkUserNameAvailability } from '../../firestore'


const LoginFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 118px;
  padding: 0px 32px 48px;
  overflow: scroll;
`
const LoginHeader = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${MAIN_FONT_COLOR};
`

const SignUpSpanContainer = styled.div`
  margin-top: 40px;
  height: 20px;
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 16px;
`
const QuestionSpan = styled.span`
  color: ${SECONDARY_FONT_COLOR};
`
const SignUpButtonSpan = styled.span`
  color: ${PRIMARY_COLOR};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`
const SignUpFooter = (props) => {
  return (
    <SignUpSpanContainer>
      <QuestionSpan>Don't have an account?</QuestionSpan>
      <SignUpButtonSpan onClick={props.onClick} role="button">Sign up</SignUpButtonSpan>
    </SignUpSpanContainer>
  )
}

const SignInFooter = (props) => {
  return (
    <SignUpSpanContainer>
      <QuestionSpan>Have an account already?</QuestionSpan>
      <SignUpButtonSpan onClick={props.onClick} role="button">Sign in</SignUpButtonSpan>
    </SignUpSpanContainer>
  )
}


// open user login
// open user signup
// open guest login
// alert username required
// alert username taken


export const UserLoginPopup = (props) => {
  const [loginDisplayed, setLoginDisplayed] = useState(false)
  const [signupDisplayed, setSignupDisplayed] = useState(false)
  const [userNameText, setUserNameText] = useState("")
  const [userNameInputFocused, setUserNameInputFocused] = useState(false)

  const parent = useRef(null)

  const updateUsernameText = (event) => {
    const newUsernameText = event.target.value
    setUserNameText(newUsernameText)
  }
  
  const displayLoginPopup = () => {
    setSignupDisplayed(false)
    setUserNameInputFocused(false)
    setLoginDisplayed(true)
  }
  const displaySignupPopup = () => {
    setLoginDisplayed(false)
    setSignupDisplayed(true)
  }
  const removePopup = () => {
    setLoginDisplayed(false)
    setSignupDisplayed(false)
    setUserNameInputFocused(false)
  }
  const displayGuestLogin = () => {
    setSignupDisplayed(false)
    setLoginDisplayed(true)
    setUserNameInputFocused(true)
  }

  const checkValidUserName = async () => {
    try {
      if (!userNameText) {
        PubSub.publish('alert username required')
        return false
      }
      const nameAvailable = await checkUserNameAvailability(userNameText)
      if (nameAvailable) { return true }
      
      PubSub.publish('alert username taken')
      return false

    } catch (error) {
      console.error("Failure to validate username entry:", error)
    }
  }

  const signUpWithGoogle = async () => {
    try {
      if (await checkValidUserName()) {
        await googlePopupSignup(userNameText)
      }
    } catch (error) {
      console.error("Failure to sign up with Google:", error)
    }
  }

  const loginAsGuest = async () => {
    try {
      if (await checkValidUserName()) {
        await anonymousGuestSignin(userNameText)
      }
    } catch (error) {
      console.error("Failure to login as guest:", error)
    }
  }

  useEffect(() => {
    parent.current && autoAnimate(parent.current)

    const loginToken = PubSub.subscribe('open user login', displayLoginPopup)
    const userSignupToken = PubSub.subscribe('open user signup', displaySignupPopup)
    const guestLoginToken = PubSub.subscribe('open guest login', displayGuestLogin)

    return () => {
      PubSub.unsubscribe(loginToken)
      PubSub.unsubscribe(guestLoginToken)
      PubSub.unsubscribe(userSignupToken)
    }
  })

  return (
    <div ref={parent}>
      {loginDisplayed 
      ? <PopupModal removePopup={removePopup} twitterLogo={true} scroll={true} >
          <LoginFormContainer>
            <LoginHeader>Sign in to Tweeter</LoginHeader>
            <FormButton google={true} onClick={googlePopupSignin}>Sign in with Google</FormButton>
            <FormButton apple={true}>Sign in with Apple</FormButton>
            <OrDivider></OrDivider>
            <UserNameInput inputFocused={userNameInputFocused} guest={true} value={userNameText} onChange={updateUsernameText} ></UserNameInput>
            <FormButton small={true} onClick={loginAsGuest}>Sign in as guest</FormButton>
            <FormButton dark={true} small={true}>What's the difference?</FormButton>
            <SignUpFooter onClick={displaySignupPopup}></SignUpFooter>
          </LoginFormContainer>
        </PopupModal>
      : '' }
      {signupDisplayed
      ? <PopupModal removePopup={removePopup} twitterLogo={true} scroll={true} >
          <LoginFormContainer>
            <LoginHeader>Join Tweeter today</LoginHeader>
            <UserNameInput inputFocused={true} value={userNameText} onChange={updateUsernameText}></UserNameInput>
            <FormButton google={true} onClick={signUpWithGoogle}>Sign up with Google</FormButton>
            <FormButton apple={true}>Sign up with Apple</FormButton>
            <OrDivider></OrDivider>
            <FormButton onClick={loginAsGuest} small={true}>Sign in as guest</FormButton>
            <FormButton dark={true} small={true}>What's the difference?</FormButton>
            <SignInFooter onClick={displayLoginPopup}></SignInFooter>
          </LoginFormContainer>
        </PopupModal>
      : '' }
    </div>
  )
}