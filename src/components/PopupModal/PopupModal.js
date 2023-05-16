import styled from "styled-components";
import { createPortal } from "react-dom";
import autoAnimate from "@formkit/auto-animate";

import { CloseButton } from "../StyledButtons/CloseButton";
import BackButton from "../StyledButtons/BackButton";
import { TwitterLogo } from "../TwitterLogo";
import { PAGE_OVERLAY_COLOR, BACKGROUND_COLOR, MAIN_FONT_COLOR } from "../constants";
import { useRef } from "react";
import { useEffect } from "react";
import { FlexBox } from "../styled-components";
import { useState } from "react";

const PopupPageOverlay = styled.div`
  position: fixed;
  z-index: 9999;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  ${props => props.slideLeft || props.slideRight ? 'display: none;' : ''}
  ${props => props.sidesDisplayed && 'display: flex;'}
  justify-content: center;
  align-items: flex-start;
  padding-top: 5vh;
  ${props => props.isShown && `background-color: ${PAGE_OVERLAY_COLOR};`}
  
  transition: transform 450ms;

  ${props => props.slideLeft && `transform: translateX(-100%);`}
  ${props => props.slideRight && `transform: translateX(100%);`}
`;
const PopupContainer = styled.div`
  position: relative;
  background-color: ${BACKGROUND_COLOR};
  border-radius: 16px;
  width: 100%;
  max-height: 90vh;
  ${props => props.height && `height: ${props.height};`}
  ${props => props.flexBox && `display: flex;`}
  ${props => props.flexBox && `flex-direction: column;`}
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
  border-radius: 16px 16px 0px 0px;
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
  const [sidesDisplayed, setSidesDisplayed] = useState(false)
  const [show, setShow] = useState(false)
  const parent = useRef(null)
  
  useEffect(() => {
    parent.current && autoAnimate(parent.current, { duration: 150 })
    parent.current && setShow(true)
  }, [parent])

  const closePopup = () => {
    setShow(false)
    props.removePopup()
  }

  useEffect(() => {
    setTimeout(() => {
      setSidesDisplayed(true)
    }, 250)
  }, [])

  return (
    <>
      {createPortal(
        <PopupPageOverlay ref={parent} isShown={show} slideRight={props.slideRight} slideLeft={props.slideLeft} sidesDisplayed={sidesDisplayed}>
          {show
          && <PopupContainer scroll={props.scroll}
                          height={props.height}
                          flexBox={props.flexBox}
                          className={props.className}>
            <StickyHeader>
              {props.removePopup
              && <CloseButtonContainer>
                    <CloseButton onClick={closePopup} />
                  </CloseButtonContainer>}
              {props.backFunction
              && <CloseButtonContainer>
                    <BackButton onClick={props.backFunction} />
                  </CloseButtonContainer>}
              {props.twitterLogo ? <TwitterLogo></TwitterLogo> : ""}
              <HeaderTitle>{props.title ? props.title : ''}</HeaderTitle>
              {props.headerButton ? props.headerButton : ""}
            </StickyHeader>
            {props.children}
          </PopupContainer>}
        </PopupPageOverlay>, 
        document.body
      )}
    </>
  );
};

export default PopupModal