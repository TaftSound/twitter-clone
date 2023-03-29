import "./page-layout.css"
import LeftSidebar from "../left-sidebar/left-sidebar"
import RightSidebar from "../right-sidebar/right-sidebar"

const PageLayout = (props) => {
  return (
    <div className="page-layout-component" data-testid="page-layout">
      <div className="sidebar-left">{<LeftSidebar/>}</div>
      <div className="center-content">{props.centerContent}</div>
      <div className="sidebar-right">{<RightSidebar/>}</div>
    </div>
  )
}

export default PageLayout