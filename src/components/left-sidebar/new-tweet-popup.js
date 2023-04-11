import styled from "styled-components"
import { PAGE_OVERLAY_COLOR, BACKGROUND_COLOR } from "../constants"
import { CloseButton } from "../styled-components"
import NewTweetEntry from "../new-tweet-entry/NewTweetEntry"

const PopupPageOverlay = styled.div`
  position: fixed;
  z-index: 9999;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 30px;
  background-color: ${PAGE_OVERLAY_COLOR};
`
const PopupContainer = styled.div`
  background-color: ${BACKGROUND_COLOR};
  border-radius: 16px;
  width: 100%;

  @media (min-width: 600px) {
    max-width: 600px;
  }
`
const PopupSubContainer = styled.div`
  padding: 0px 16px;
`

const CloseButtonContainer = styled.div`
  height: 53px;
  width: 34px;
  position: relative;
  left: -7px;
  display: flex;
  justify-content: center;
  align-items: center;
`


const NewTweetPopup = (props) => {
  
    return (
      <PopupPageOverlay>
        <PopupContainer>
          <PopupSubContainer>
            <CloseButtonContainer >
              <CloseButton onClick={props.removePopup} />
            </CloseButtonContainer>
          </PopupSubContainer>
          <NewTweetEntry userName={props.userName} popup={true}></NewTweetEntry>
        </PopupContainer>
      </PopupPageOverlay>
    )
}

export default NewTweetPopup