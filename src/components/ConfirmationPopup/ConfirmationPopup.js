import styled from "styled-components"
import { createPortal } from "react-dom"

import { ALERT_RED, BACKGROUND_COLOR, MAIN_FONT_COLOR, PAGE_OVERLAY_COLOR, SECONDARY_FONT_COLOR } from "../constants"
import { TwitterLogoLarge } from '../TwitterLogo'
import { FormButton } from '../StyledButtons/FormButton'

const BackgroundDiv = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99999;
  ${props => props.transparent ? '' : `background-color: ${BACKGROUND_COLOR};`}
`
const OverlayDiv = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  ${props => props.noOverlay ? '' : `background-color: ${PAGE_OVERLAY_COLOR}};`}
`
const PopupContainer = styled.div`
  position: absolute;
  z-index: 999999;
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
const ConfirmFormButton = styled(FormButton)`
  height: 44px;
  width: 100%;
  margin: 0px;
  margin-top: 12px;
  ${props => props.deleteButton ? `background-color: ${ALERT_RED};` : ''}
  ${props => props.deleteButton ? `color: ${MAIN_FONT_COLOR};` : ''}
`

const ConfirmationPopup = (props) => {
  const { confirmFunction, 
          cancelFunction, 
          confirmText, 
          header, 
          transparent, 
          deleteButton, 
          tweeterLogo } = props

  return (
    <>
      {createPortal(
        <BackgroundDiv transparent={transparent}>
          <OverlayDiv noOverlay={props.noOverlay}>
            <PopupContainer>
              {tweeterLogo
              ? <LogoContainer>
                  <TwitterLogoLarge/>
                </LogoContainer>
              : false}
              <Header>{header}</Header>
              <Text>
                {props.children}
              </Text>
              <ConfirmFormButton deleteButton={deleteButton} onClick={confirmFunction}>{confirmText}</ConfirmFormButton>
              <ConfirmFormButton onClick={cancelFunction} dark={true}>Cancel</ConfirmFormButton>
            </PopupContainer>
          </OverlayDiv>
        </BackgroundDiv>,
        document.body
      )}
    </>
  )
}

export default ConfirmationPopup