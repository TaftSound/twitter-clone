import styled from "styled-components"
import { BACKGROUND_COLOR, DIVIDER_COLOR, PRIMARY_COLOR } from "../constants" 

export const PageLayoutContainer = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr;
  max-height: 100vh;
  overflow: scroll;
  background-color: ${BACKGROUND_COLOR};
`

export const LeftSidebarContainer = styled.div`
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
  height: 100vh;
  position: sticky;
  top: 0px;
  z-index: 10;
  
  @media (min-width: 600px) {
    
  }

  @media (min-width: 690px) {
    width: calc(35vw - 153px);
  }

  @media (min-width: 988px) {
    width: calc(55vw - 475px);
  }

  @media (min-width: 1008px) {
    width: calc(51vw - 425px);
  }

  @media (min-width: 1078px) {
    width: calc(51vw - 461px);
  }

  @media (min-width: 1200px) {
    
  }
`

export const ContentContainer = styled.div`
  background-color: ${BACKGROUND_COLOR};
  display: grid;
  grid-template-columns: 1fr min-content;
  max-height: 100vh;
  position: sticky;
  top: 0px;
  width: 100%;

  @media (min-width: 690px) {
    grid-template-columns: 600px 1fr;
  }
`

export const CenterContainer = styled.div`
  background-color: ${BACKGROUND_COLOR};
  border-right: solid 1px ${DIVIDER_COLOR};
  box-sizing: border-box;
  min-height: 100vh;
  height: max-content;
  overflow-x: hidden;
  padding-bottom: 72px;
  width: 100%;
  /* position: relative;
  z-index: 0; */

  @media (min-width: 600px) {
    max-width: 600px;
  }

`
export const RightContainer = styled.div`
  border-right: solid 1px ${DIVIDER_COLOR};
  box-sizing: border-box;
  height: 100vh;
  overflow-x: hidden;
  padding-bottom: 72px;
  width: 100%;
  overflow: hidden;
  visibility: hidden;
  display: none;

  @media (min-width: 690px) {
    visibility: visible;
    display: block;
  }
  @media (min-width: 1078px) {
    padding-left: 10px;
  }
`

export const SubContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  max-width: 100%;
  overflow: visible;
`

export const SidebarScrollContent = styled.div`
  background-color: ${BACKGROUND_COLOR};
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  padding-left: 20px;
  padding-bottom: 100px;
  position: relative;
`

export const SidebarSearchContainer = styled.div`
  position: relative;
  z-index: 10;
  padding: 4px 16px;
  background-color: ${BACKGROUND_COLOR};
`
