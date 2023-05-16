import styled from "styled-components"
import { useEffect, useState } from "react"
import PubSub from "pubsub-js"

import { MAIN_FONT_COLOR, PRIMARY_COLOR, SECONDARY_FONT_COLOR } from "../constants"

import PopupModal from "../PopupModal/PopupModal"
import { FormButton } from "../StyledButtons/FormButton"
import { OrDivider } from "./OrDivider"
import { UserNameInput } from "./UserNameInput"

import { anonymousGuestSignin, googlePopupSignin, googlePopupSignup  } from "../../firebase/auth"
import { checkUserNameAvailability } from "../../firebase/firestore/user-functions"
import { useNavigate } from "react-router-dom"
import GuestUserExplanation from "./GuestUserExplanation"
import { FlexBox } from "../styled-components"
import { useRef } from "react"


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
const LoginText = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: ${MAIN_FONT_COLOR};
  margin: 0px;
  margin-top: -5px;
  margin-bottom: 53px;
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
  const [loginDisplayed, setLoginDisplayed] = useState(false)
  const [signupDisplayed, setSignupDisplayed] = useState(false)
  const [signupAlertDisplayed, setSignupAlertDisplayed] = useState(false)
  const [explanationDisplayed, setExplanationDisplayed] = useState(false)
  const [userNameText, setUserNameText] = useState("")
  const [userNameInputFocused, setUserNameInputFocused] = useState(false)

  const currentPopupRef = useRef(null)

  const navigate = useNavigate()

  const updateUsernameText = (event) => {
    const newUsernameText = event.target.value
    setUserNameText(newUsernameText)
  }
  
  const displayLoginPopup = () => {
    currentPopupRef.current = "login"
    setSignupDisplayed(false)
    setUserNameInputFocused(false)
    setLoginDisplayed(true)
    PubSub.publish('clear username alert')
  }
  const displaySignupPopup = () => {
    currentPopupRef.current = "signup"
    setLoginDisplayed(true)
    setSignupDisplayed(true)
    setUserNameInputFocused(true)
    PubSub.publish('focus username input', currentPopupRef.current)
    PubSub.publish('clear username alert')
  }
  const removePopup = () => {
    currentPopupRef.current = null
    setSignupAlertDisplayed(false)
    setLoginDisplayed(false)
    setSignupDisplayed(false)
    setUserNameInputFocused(false)
    setUserNameText("")
    setUserNameInputFocused(false)
  }
  const displayGuestLogin = () => {
    currentPopupRef.current = "login"
    setSignupDisplayed(false)
    setLoginDisplayed(true)
    setUserNameInputFocused(true)
    PubSub.publish('focus username input', currentPopupRef.current)
    PubSub.publish('clear username alert')
  }
  const displayExplanation = () => {
   setExplanationDisplayed(true)
  }
  const removeExplanation = () => {
    setExplanationDisplayed(false)
    if (currentPopupRef.current === 'signup') {
      PubSub.publish('focus username input', currentPopupRef.current)
    }
    PubSub.publish('clear username alert')
   }

  const checkValidUserName = async () => {
    try {
      if (!userNameText) {
        PubSub.publish('alert username required')
        PubSub.publish('focus username input', currentPopupRef.current)
        return false
      }
      const nameAvailable = await checkUserNameAvailability(userNameText)
      if (nameAvailable) { return true }
      
      PubSub.publish('alert username taken')
      PubSub.publish('focus username input', currentPopupRef.current)
      return false

    } catch (error) {
      console.error("Failure to validate username entry:", error)
    }
  }

  const signUpWithGoogle = async () => {
    try {
      if (await checkValidUserName()) {
        await googlePopupSignup(userNameText)
        navigate('/home')
      }
    } catch (error) {
      console.error("Failure to sign up with Google:", error)
    }
  }

  const logInWithGoogle = async () => {
    try {
      const loggedIn = await googlePopupSignin()
      if (loggedIn) {
        navigate('/home')
      } else {
        setSignupAlertDisplayed(true)
      }
    } catch (error) {
      console.error("Failure to sign in with Google:", error)
    }
  }

  const refuseSignup = () => {
    setSignupAlertDisplayed(false)
  }

  const agreeToSignup = () => {
    setTimeout(() => { setSignupAlertDisplayed(false) }, 250)
    displaySignupPopup()
  }

  const loginAsGuest = async () => {
    try {
      if (await checkValidUserName()) {
        await anonymousGuestSignin(userNameText)
        navigate('/home')
      }
    } catch (error) {
      console.error("Failure to login as guest:", error)
    }
  }

  useEffect(() => {

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
    <>
      {loginDisplayed
      && <PopupModal removePopup={removePopup} twitterLogo={true} scroll={true} slideLeft={explanationDisplayed || signupDisplayed}>
          {signupAlertDisplayed 
          ? <LoginFormContainer>
              <FlexBox height="40px"></FlexBox>
              <LoginHeader>Create an account?</LoginHeader>
              <LoginText>It appears that there is no Tweeter acount associated with this email, 
                would you like to create a new account?</LoginText>
              <FormButton onClick={agreeToSignup} colorButton={true}>Sign up</FormButton>
              <FormButton dark={true} onClick={refuseSignup}>No thanks</FormButton>
              <FlexBox height="40px"></FlexBox>
            </LoginFormContainer>
          : <LoginFormContainer>
              <LoginHeader>Sign in to Tweeter</LoginHeader>
              <FormButton google={true} onClick={logInWithGoogle}>Sign in with Google</FormButton>
              {/* <FormButton apple={true}>Sign in with Apple</FormButton> */}
              <OrDivider></OrDivider>
              <UserNameInput form="login" inputFocused={userNameInputFocused} guest={true} value={userNameText} onChange={updateUsernameText} ></UserNameInput>
              <FormButton small={true} onClick={loginAsGuest}>Sign in as guest</FormButton>
              <FormButton dark={true} small={true} onClick={displayExplanation}>What's the difference?</FormButton>
              <SignUpFooter onClick={displaySignupPopup}></SignUpFooter>
            </LoginFormContainer>}
        </PopupModal>
        }
      {loginDisplayed
      && <PopupModal removePopup={removePopup} twitterLogo={true} scroll={true} slideLeft={explanationDisplayed} slideRight={!signupDisplayed}>
          <LoginFormContainer>
            <LoginHeader>Join Tweeter today</LoginHeader>
            <UserNameInput form="signup" value={userNameText} onChange={updateUsernameText}></UserNameInput>
            <FormButton google={true} onClick={signUpWithGoogle}>Sign up with Google</FormButton>
            {/* <FormButton apple={true}>Sign up with Apple</FormButton> */}
            <OrDivider></OrDivider>
            <FormButton onClick={loginAsGuest} small={true}>Sign in as guest</FormButton>
            <FormButton dark={true} small={true} onClick={displayExplanation}>What's the difference?</FormButton>
            <SignInFooter onClick={displayLoginPopup}></SignInFooter>
          </LoginFormContainer>
        </PopupModal>}
      {loginDisplayed 
      && <GuestUserExplanation slideRight={!explanationDisplayed} backFunction={removeExplanation}></GuestUserExplanation>}
    </>
  )
}