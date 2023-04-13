import styled from "styled-components";
import { CloseButton } from "../styled-components";
import { TwitterLogo } from "./TwitterLogo";
import { PAGE_OVERLAY_COLOR, BACKGROUND_COLOR } from "../constants";

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
  overflow: scroll;
  overflow: auto;
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
  top: 0;
  padding: 0px 16px;
  background-color: ${BACKGROUND_COLOR};
`;
const CloseButtonContainer = styled.div`
  position: relative;
  height: 53px;
  width: 34px;
  left: -7px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupModal = (props) => {

  return (
    <PopupPageOverlay>
      <PopupContainer>
        <StickyHeader>
          <CloseButtonContainer>
            <CloseButton onClick={props.removePopup} />
          </CloseButtonContainer>
          <TwitterLogo></TwitterLogo>
        </StickyHeader>
        {props.children}
      </PopupContainer>
    </PopupPageOverlay>
  );
};

export default PopupModal