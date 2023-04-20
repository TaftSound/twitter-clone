import PageLayout from "../PageLayout/PageLayout"
import NewTweetEntry from "../NewTweetEntry/NewTweetEntry"
import Header from "../Header/Header"
import TweetDisplay from "../TweetDisplay/TweetDisplay"

const HomePage = (props) => {

  return (
    <div className="home-page">
      <PageLayout centerContent={[
        <Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following"]} />,
        <NewTweetEntry />,
        <TweetDisplay></TweetDisplay>
      ]}/>
    </div>
  )
}

export default HomePage