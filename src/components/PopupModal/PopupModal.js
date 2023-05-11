import styled from "styled-components";
import { createPortal } from "react-dom";

import { CloseButton } from "../StyledButtons/CloseButton";
import { TwitterLogo } from "../TwitterLogo";
import { PAGE_OVERLAY_COLOR, BACKGROUND_COLOR, MAIN_FONT_COLOR } from "../constants";

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
  padding-top: 5vh;
  background-color: ${PAGE_OVERLAY_COLOR};
`;
const PopupContainer = styled.div`
  position: relative;
  background-color: ${BACKGROUND_COLOR};
  border-radius: 16px;
  width: 100%;
  max-height: 90vh;
  overflow: ${props => props.scroll ? 'scroll' : 'visible'};
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 600px) {
    max-width: 600px;
  }
`;
const StickyHeader = styled.div`
  position: sticky;
  z-index: 9;
  top: 0;
  padding: 0px 16px;
  border-radius: 16px;
  background-color: ${BACKGROUND_COLOR};
  display: flex;
  align-items: center;
`;
const CloseButtonContainer = styled.div`
  position: relative;
  height: 53px;
  width: 34px;
  margin-right: 22px;
  left: -7px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const HeaderTitle = styled.h1`
  color: ${MAIN_FONT_COLOR};
  font-size: 21px;
  margin: 0px;
  flex: 1;
`

const PopupModal = (props) => {

  // Create user display name input
  // Create user Bio input
  // Create functionality to update firestore for user profile
  // Create display for user bio
  // Create banner image form input
  // Create user image form input
  // Create image resizer component
  // Create database storage and firestore url storage for image upload

  return (
    <>
      {createPortal(
        <PopupPageOverlay> 
          <PopupContainer scroll={props.scroll}>
            <StickyHeader>
              <CloseButtonContainer>
                <CloseButton onClick={props.removePopup} />
              </CloseButtonContainer>
              {props.twitterLogo ? <TwitterLogo></TwitterLogo> : ""}
              <HeaderTitle>{props.title ? props.title : ''}</HeaderTitle>
              {props.headerButton ? props.headerButton : ""}
            </StickyHeader>
            {props.children}
          </PopupContainer>
        </PopupPageOverlay>, 
        document.body
      )}
    </>
  );
};

export default PopupModal