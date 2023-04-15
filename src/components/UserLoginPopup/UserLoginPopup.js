import styled from "styled-components"
import { useEffect, useLayoutEffect, useState } from "react"
import PubSub from "pubsub-js"

import { MAIN_FONT_COLOR, PRIMARY_COLOR, SECONDARY_FONT_COLOR } from "../constants"

import PopupModal from "../PopupModal/PopupModal"
import { FormButton } from "../FormButton"
import { OrDivider } from "./OrDivider"
import { UserNameInput } from "./UserNameInput"

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

export const UserLoginPopup = (props) => {
  const [popupDisplayed, setPopupDisplayed] = useState(false)
  const [userNameText, setUserNameText] = useState("")
  const [userNameInputFocused, setUserNameInputFocused] = useState(false)

  const updateUsernameText = (event) => {
    const newUsernameText = event.target.value
    setUserNameText(newUsernameText)
  }
  
  useEffect(() => {
    const displayPopup = () => { setPopupDisplayed(true) }
    const guestLogin = () => {
      setPopupDisplayed(true)
      setUserNameInputFocused(true)
    }

    const loginToken = PubSub.subscribe('login user', displayPopup)
    const guestLoginToken = PubSub.subscribe('guest login', guestLogin)

    return () => {
      PubSub.unsubscribe(loginToken)
      PubSub.unsubscribe(guestLoginToken)
    }
  })
  
  const removePopup = () => {
    setPopupDisplayed(false)
    setUserNameInputFocused(false)
  }
  const openSignUp = () => {
    setPopupDisplayed(false)
    setUserNameInputFocused(false)
    PubSub.publish('signup user')
  }

  return popupDisplayed 
  ? (  
      <PopupModal removePopup={removePopup} >
        <LoginFormContainer>
          <LoginHeader>Sign in to Tweeter</LoginHeader>
          <FormButton google={true}>Sign in with Google</FormButton>
          <FormButton apple={true}>Sign in with Apple</FormButton>
          <OrDivider></OrDivider>
          <UserNameInput inputFocused={userNameInputFocused} guest={true} value={userNameText} onChange={updateUsernameText} ></UserNameInput>
          <FormButton small={true}>Sign in as guest</FormButton>
          <FormButton dark={true} small={true}>What's the difference?</FormButton>
          <SignUpFooter onClick={openSignUp}></SignUpFooter>
        </LoginFormContainer>
      </PopupModal>
  )
  : false
}

export const UserSignupPopup = (props) => {
  const [popupDisplayed, setPopupDisplayed] = useState(false)
  
  useEffect(() => {
    const displayPopup = () => { setPopupDisplayed(true) }

    const loginToken = PubSub.subscribe('signup user', displayPopup)

    return () => { PubSub.unsubscribe(loginToken) }
  })
  
  const removePopup = () => { setPopupDisplayed(false) }
  const openLogin = () => {
    setPopupDisplayed(false)
    PubSub.publish('login user')
  }
  const openGuestLogin = () => {
    setPopupDisplayed(false)
    PubSub.publish('guest login')
  }

  return popupDisplayed 
  ? (  
      <PopupModal removePopup={removePopup} >
        <LoginFormContainer>
          <LoginHeader>Join Tweeter today</LoginHeader>
          <FormButton google={true}>Sign up with Google</FormButton>
          <FormButton apple={true}>Sign up with Apple</FormButton>
          <OrDivider></OrDivider>
          <FormButton onClick={openGuestLogin} small={true}>Sign in as guest</FormButton>
          <FormButton dark={true} small={true}>What's the difference?</FormButton>
          <SignInFooter onClick={openLogin}></SignInFooter>
        </LoginFormContainer>
      </PopupModal>
  )
  : false
}
