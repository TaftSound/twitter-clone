
import PageLayout from "../PageLayout/PageLayout"
import NewTweetEntry from "../NewTweetEntry/NewTweetEntry"
import Header from "../Header/Header"
import MainFeed from "../MainFeed/MainFeed"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../App"
import LoadingPage from "../LoadingPage/LoadingPage"
import { useMemo } from "react"


const HomePage = (props) => {
  const userContext = useContext(UserContext)
  const [pageDisplayed, setPageDisplayed] = useState(false)

  const memoizedUserData = useMemo(() => {
    const userId = userContext ? userContext.userId : false
    return userId
  }, [userContext])

  useEffect(() => {
    memoizedUserData ? setPageDisplayed(true) : setPageDisplayed(false)
  }, [memoizedUserData])

  return pageDisplayed
  ? (
    <div className="home-page">
      <PageLayout centerContent={[
        <Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following"]} />,
        <NewTweetEntry />,
        pageDisplayed ? <MainFeed></MainFeed> : false
      ]}/>
    </div>
  )
  : <LoadingPage logo={true}></LoadingPage>
}

export default HomePage