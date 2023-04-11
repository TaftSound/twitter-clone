import "./home-page.css"
import PageLayout from "../page-layout/page-layout"
import NewTweetEntry from "../new-tweet-entry/new-tweet-entry"
import Header from "./header"


const HomePage = (props) => {
  return (
    <div className="home-page">
      <PageLayout userName="Guest" centerContent={[
        <Header/>,
        <NewTweetEntry userName="Guest"/>
      ]}/>
    </div>
  )
}

export default HomePage