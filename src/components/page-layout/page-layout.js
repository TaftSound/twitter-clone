import LeftSidebar from "../left-sidebar/left-sidebar"
import RightSidebar from "../right-sidebar/right-sidebar"

import { PageLayoutContainer, LeftContainer, RightContainer, CenterContainer } from "./styled-containers"



const PageLayout = (props) => {
  return (
    <PageLayoutContainer>
      <LeftContainer>{<LeftSidebar/>}</LeftContainer>
      <RightContainer>
        <CenterContainer>
          {props.centerContent}
        </CenterContainer>
        {<RightSidebar/>}
      </RightContainer>
    </PageLayoutContainer>
  )
}

export default PageLayout