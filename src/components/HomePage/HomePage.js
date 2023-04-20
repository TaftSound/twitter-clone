import PageLayout from "../PageLayout/PageLayout"
import NewTweetEntry from "../NewTweetEntry/NewTweetEntry"
import Header from "../Header/Header"
import TweetDisplay from "../TweetDisplay/TweetDisplay"

const fakeUserData = {
  userName: "GeorgeTakei69",
  displayName: "George Takei",
}

const fakeTweetData = {
  timestamp: 1681935135861,
  text: "Herro mah bros",
  likes: {
    userid1: 928347293,
    userid2: 728547293,
    userid3: 701527293,
  }
}

const HomePage = (props) => {

  return (
    <div className="home-page">
      <PageLayout centerContent={[
        <Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following"]} />,
        <NewTweetEntry />,
        <TweetDisplay userData={fakeUserData} tweetData={fakeTweetData} ></TweetDisplay>
      ]}/>
    </div>
  )
}

export default HomePage