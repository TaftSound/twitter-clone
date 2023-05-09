
import PageLayout from "../PageLayout/PageLayout"
import NewTweetEntry from "../NewTweetEntry/NewTweetEntry"
import Header, { ProfileHeader } from "../Header/Header"
import MainFeed from "../MainFeed/MainFeed"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../App"
import LoadingPage from "../LoadingPage/LoadingPage"
import { useMemo } from "react"
import SidebarWhoToFollow from "../WhoToFollow/SidebarWhoToFollow"
import ProfileDetails from "../ProfileDetails/ProfileDetails"
import ProfileFeed from "../MainFeed/ProfileFeed"


const AppPage = (props) => {
  const userContext = useContext(UserContext)
  const [pageDisplayed, setPageDisplayed] = useState(false)

  const memoizedUserData = useMemo(() => {
    const userId = userContext ? userContext.userId : false
    return userId
  }, [userContext])

  useEffect(() => {
    memoizedUserData ? setPageDisplayed(true) : setPageDisplayed(false)
  }, [memoizedUserData])

  if (props.current === 'home' ) {
    return pageDisplayed
    ? (
      <div className="home-page">
        <PageLayout 
        header={<Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following"]} />}
        centerContent={[
          <NewTweetEntry />,
          pageDisplayed ? <MainFeed></MainFeed> : false
        ]}
        sidebarContent={[
          <SidebarWhoToFollow></SidebarWhoToFollow>
        ]}
        />
      </div>
    )
    : <LoadingPage logo={true}></LoadingPage>
  }

  if (props.current === 'profile') {
    return pageDisplayed
    ? (
      <div className="home-page">
        <PageLayout 
        header={<ProfileHeader titleHeader={userContext.displayName} />}
        centerContent={[
          <ProfileDetails></ProfileDetails>,
          <Header defaultTab="Tweets" tabsArray={["Tweets", "Likes"]}></Header>,
          pageDisplayed ? <ProfileFeed></ProfileFeed> : false
        ]}
        sidebarContent={[
          <SidebarWhoToFollow></SidebarWhoToFollow>
        ]}
        />
      </div>
    )
    : <LoadingPage logo={true}></LoadingPage>
  }
}

export default AppPage