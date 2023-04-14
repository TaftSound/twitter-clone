import styled from "styled-components"
import { useEffect, useState } from "react"
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
`
const SignUpFooter = (props) => {
  return (
    <SignUpSpanContainer>
      <QuestionSpan>Don't have an account?</QuestionSpan>
      <SignUpButtonSpan role="button">Sign up</SignUpButtonSpan>
    </SignUpSpanContainer>
  )
}

const UserLoginPopup = (props) => {
  const [popupDisplayed, setPopupDisplayed] = useState(false)
  const [userNameText, setUserNameText] = useState("")

  const updateUsernameText = (event) => {
    const newUsernameText = event.target.value
    setUserNameText(newUsernameText)
  }
  
  useEffect(() => {
    const displayPopup = () => { setPopupDisplayed(true) }

    const loginToken = PubSub.subscribe('login user', displayPopup)

    return () => { PubSub.unsubscribe(loginToken) }
  })
  
  const removePopup = () => { setPopupDisplayed(false) }

  return popupDisplayed 
  ? (  
      <PopupModal removePopup={removePopup} >
        <LoginFormContainer>
          <LoginHeader>Sign in to Tweeter</LoginHeader>
          <FormButton google={true}>Sign in with Google</FormButton>
          <FormButton apple={true}>Sign in with Apple</FormButton>
          <OrDivider></OrDivider>
          <UserNameInput guest={true} value={userNameText} onChange={updateUsernameText} ></UserNameInput>
          <FormButton small={true}>Sign in as guest</FormButton>
          <FormButton dark={true} small={true}>What's the difference?</FormButton>
          <SignUpFooter></SignUpFooter>
        </LoginFormContainer>
      </PopupModal>
  )
  : false
}

export default UserLoginPopup