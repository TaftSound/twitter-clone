import styled from "styled-components"
import { BACKGROUND_COLOR, DIVIDER_COLOR } from "../constants" 

export const PageLayoutContainer = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
`

export const LeftContainer = styled.div`
  background-color: ${BACKGROUND_COLOR};
  border-right: solid 1px ${DIVIDER_COLOR};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  align-items: flex-end;
  flex-grow: 1;
  flex-shrink: 0;
  width: min-content;
  min-height: 100vh;
  
  @media (min-width: 600px) {
    
  }

  @media (min-width: 690px) {
    width: calc(35vw - 153px);
  }

  @media (min-width: 992px) {
    
  }

  @media (min-width: 1200px) {
    
  }
`

export const RightContainer = styled.div`
  background-color: ${BACKGROUND_COLOR};
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  flex-grow: 2;
  flex-shrink: 1;
  align-items: flex-start;
  min-height: 100vh;
  
  
  @media (min-width: 600px) {
    
  }

  @media (min-width: 690px) {
    
  }

  @media (min-width: 992px) {
    
  }

  @media (min-width: 1200px) {
    
  }
`

export const CenterContainer = styled.div`
  background-color: ${BACKGROUND_COLOR};
  border-right: solid 1px ${DIVIDER_COLOR};
  min-height: 100vh;
  width: 100%;

  @media (min-width: 600px) {
    max-width: 600px;
  }

  @media (min-width: 690px) {
    
  }

  @media (min-width: 992px) {
    
  }

  @media (min-width: 1200px) {
    
  }
`