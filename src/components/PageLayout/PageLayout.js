import PropTypes from 'prop-types'
import LeftSidebar from "../LeftSidebar/LeftSidebar"
import RightSidebar from "../RightSidebar/RightSidebar"
import uniqid from 'uniqid'

import { PageLayoutContainer, LeftContainer, RightContainer, CenterContainer, SubContainer } from "./StyledContainers"


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