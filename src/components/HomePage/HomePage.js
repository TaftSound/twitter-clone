import PageLayout from "../PageLayout/PageLayout"
import NewTweetEntry from "../NewTweetEntry/NewTweetEntry"
import Header from "../Header/Header"


const HomePage = (props) => {
  return (
    <div className="home-page">
      <PageLayout userName="Guest" centerContent={[
        <Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following"]} />,
        <NewTweetEntry userName="Guest"/>
      ]}/>
    </div>
  )
}

export default HomePage