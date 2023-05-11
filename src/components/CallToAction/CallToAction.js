import styled from "styled-components";
import { createPortal } from "react-dom";

import { PRIMARY_COLOR } from "../constants";
import { FormButton } from "../StyledButtons/FormButton";
import PubSub from "pubsub-js";

const CallToActionContainer = styled.div`
  position: absolute;
  z-index: 11;
  bottom: 0px;
  display: flex;
  justify-content: center;
  width: 100vw;
  max-height: 52px;
  overflow: hidden;
  padding: 10px 0px;
  background-color: ${PRIMARY_COLOR};
`
const CallToActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  max-width: 600px;
`
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  top: -2px;
`
const H1 = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 1px 0px;
`
const H2 = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: white;
  margin: 0px;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`
const ActionFormButton = styled(FormButton)`
  margin: 0px;
`

const CallToAction = (props) => {
  const loginUser = () => { PubSub.publish('open user login') }
  const signupUser = () => { PubSub.publish('open user signup') }

  return (
    <>
      {createPortal(
        <CallToActionContainer>
          <CallToActionContent>
            <MessageContainer>
              <H1>Don't miss what's happening</H1>
              <H2>Some people on Tweeter are even real!</H2>
            </MessageContainer>
            <ButtonContainer>
              <ActionFormButton onClick={loginUser} small={true} colorButton={true}>Login</ActionFormButton>
              <ActionFormButton onClick={signupUser} small={true}>Sign Up</ActionFormButton>
            </ButtonContainer>
          </CallToActionContent>
        </CallToActionContainer>,
        document.body
      )}
    </>
  )
}

export default CallToAction