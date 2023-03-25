import "./page-layout.css"


const PageLayout = (props) => {
  return (
    <div className="page-layout-component">
      <div className="sidebar-content-left">{}</div>
      <div className="center-content">{props.centerContent}</div>
      <div className="sidebar-content-right">{props.sidebarContentRight}</div>
    </div>
  )
}

export default PageLayout