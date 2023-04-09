import PropTypes from 'prop-types'
import LeftSidebar from "../left-sidebar/left-sidebar"
import RightSidebar from "../right-sidebar/right-sidebar"
import uniqid from 'uniqid'

import { PageLayoutContainer, LeftContainer, RightContainer, CenterContainer, SubContainer } from "./styled-containers"


const structureCenterContent = (elementArray) => {
  const structuredElements = elementArray.map((element) => {
    return <SubContainer key={uniqid()}>{element}</SubContainer>
  })
  return structuredElements
}

const PageLayout = (props) => {
  return (
    <PageLayoutContainer>
      <LeftContainer>{<LeftSidebar userName={props.userName}/>}</LeftContainer>
      <RightContainer>
        <CenterContainer>
          {structureCenterContent(props.centerContent)}
        </CenterContainer>
        <RightSidebar/>
      </RightContainer>
    </PageLayoutContainer>
  )
}

PageLayout.propTypes = {
  centerContent: PropTypes.array
}

export default PageLayout