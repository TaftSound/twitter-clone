import PageLayout from "../PageLayout/PageLayout"
import NewTweetEntry from "../NewTweetEntry/NewTweetEntry"
import Header from "../Header/Header"
import TweetDisplay from "../TweetDisplay/TweetDisplay"
import MainFeed from "../MainFeed/MainFeed"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../App"
import LoadingPage from "../LoadingPage/LoadingPage"

const fakeTweetData = {
  userName: "GeorgeTakei69",
  displayName: "George Takei",
  timestamp: 1681935135861,
  text: "Herro mah bros",
  likes: {
    userid1: 928347293,
    userid2: 728547293,
    userid3: 701527293,
  }
}

const HomePage = (props) => {
  const userData = useContext(UserContext)
  const [pageDisplayed, setPageDisplayed] = useState(false)

  useEffect(() => {
    userData ? setPageDisplayed(true) : setPageDisplayed(false)
  }, [userData])

  return pageDisplayed
  ? (
    <div className="home-page">
      <PageLayout centerContent={[
        <Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following"]} />,
        <NewTweetEntry />,
        pageDisplayed ? <MainFeed></MainFeed> : ''
      ]}/>
    </div>
  )
  : <LoadingPage></LoadingPage>
}

export default HomePage