import styled from "styled-components"
import { getAuth } from 'firebase/auth'

import { BACKGROUND_COLOR, MAIN_FONT_COLOR, PAGE_OVERLAY_COLOR, SECONDARY_FONT_COLOR } from "../constants"
import { TwitterLogoLarge } from '../TwitterLogo'
import { FormButton } from '../FormButton'
import { useEffect } from "react"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"

const BackgroundDiv = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${BACKGROUND_COLOR};
`
const OverlayDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${PAGE_OVERLAY_COLOR};
`
const PopupContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  box-sizing: border-box;
  max-height: 100vh;
  max-width: 100vw;
  padding: 32px;
  border-radius: 16px;
  background-color: ${BACKGROUND_COLOR};
`
const LogoContainer = styled.div`
  position: relative;
  height: 40px;
  margin-bottom: 16px;
`
const Header = styled.h1`
  color: ${MAIN_FONT_COLOR};
  font-size: 21px;
  font-weight: 700;
  margin: 0px;
  margin-bottom: 8px;
`
const Text = styled.p`
  font-size: 16px;
  color: ${SECONDARY_FONT_COLOR};
  margin: 0px;
  margin-bottom: 12px;
`
const LogoutFormButton = styled(FormButton)`
  height: 44px;
  width: 100%;
  margin: 0px;
  margin-top: 12px;
`

const LogoutPage = (props) => {
  const navigate = useNavigate()

  const logoutButtonRef = useRef(null)
  const cancelButtonRef = useRef(null)
  
  useEffect(() => {
    const logout = () => { getAuth().signOut() }
    const cancelLogout = () => { navigate(-1) }

    const logoutButton = logoutButtonRef.current
    const cancelButton = cancelButtonRef.current
    
    logoutButton.addEventListener('click', logout)
    cancelButton.addEventListener('click', cancelLogout)

    return () => {
      logoutButton.removeEventListener('click', logout)
      cancelButton.removeEventListener('click', cancelLogout)
    }
  }, [navigate])

  return (
    <BackgroundDiv>
      <OverlayDiv>
        <PopupContainer>
          <LogoContainer>
            <TwitterLogoLarge/>
          </LogoContainer>
          <Header>Log out of Tweeter?</Header>
          <Text>
            You can always log back in at any time.
            If you just want to switch accounts, 
            you can do that by adding an existing account.
          </Text>
          <LogoutFormButton reference={logoutButtonRef}>Log out</LogoutFormButton>
          <LogoutFormButton reference={cancelButtonRef} dark={true}>Cancel</LogoutFormButton>
        </PopupContainer>
      </OverlayDiv>
    </BackgroundDiv>
  )
}

export default LogoutPage