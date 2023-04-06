import "./home-page.css"
import PageLayout from "../page-layout/page-layout"
import NewTweetEntry from "../new-tweet-entry/NewTweetEntry"
import Header from "./header"
import styled from "styled-components"
import { BACKGROUND_COLOR, DIVIDER_COLOR } from "../constants"

const CenterContainer = styled.div`
  background-color: ${BACKGROUND_COLOR};
  border-bottom: solid 1px ${DIVIDER_COLOR};
  max-width: 100%;
  overflow: hidden;
`

const HomePage = (props) => {
  return (
    <div className="home-page">
      <PageLayout centerContent={
        <>
          <CenterContainer>
            <Header/>
          </CenterContainer>
          <CenterContainer>
            <NewTweetEntry userName="Guest"/>
          </CenterContainer>
        </>
      }/>
    </div>
  )
}

export default HomePage