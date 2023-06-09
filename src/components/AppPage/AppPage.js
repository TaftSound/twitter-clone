
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
import VisitProfileDetails from "../ProfileDetails/VisitProfileDetails"
import { useLocation } from "react-router-dom"
import { getUserDataById } from "../../firebase/firestore/current-user-data"
import { getFollowList } from "../../firebase/firestore/follower-list-functions"
import { createContext } from "react"
import PubSub from "pubsub-js"


export const VisitContext = createContext(null)
export const VisitFollowContext = createContext(null)

const AppPage = (props) => {
  const userContext = useContext(UserContext)

  const [pageDisplayed, setPageDisplayed] = useState(false)
  const [visitData, setVisitData] = useState(false)
  const [visitFollowData, setVisitFollowData] = useState(false)
  const [currentTab, setCurrentTab] = useState(null)

  const location = useLocation()

  useEffect(() => {
    setVisitData(false)
    setVisitFollowData(false)

    const getVisitedUserData = async (userId) => {
      const userData = await getUserDataById(userId)
      const userFollowData = await getFollowList(userId)
      setVisitData(userData)
      setVisitFollowData(userFollowData)
    }

    const locationSegments = location.pathname.split('/')
    if (locationSegments[1] === 'visit-profile') {
      const user = locationSegments[2]
      getVisitedUserData(user)
    }

    setCurrentTab(null)
  }, [location])

  useEffect(() => {
    const unsubToken = PubSub.subscribe('update visit data', (msg, data) => {
      const visitDataCopy = visitData
      if (data.displayName) { visitDataCopy.displayName = data.displayName }
      if (data.bio) { visitDataCopy.bio = data.bio }
      if (data.bannerImageUrl) { visitDataCopy.bannerImageUrl = data.bannerImageUrl }
      if (data.profileImageUrl) { visitDataCopy.profileImageUrl = data.profileImageUrl }
      if (data.bannerImageUrl === false) { visitDataCopy.bannerImageUrl = "" }
      if (data.profileImageUrl === false) { visitDataCopy.profileImageUrl = "" }
      if (data.bannerImageAdjustment) { visitDataCopy.bannerImageAdjustment = data.bannerImageAdjustment }
      if (data.profileImageAdjustment) { visitDataCopy.profileImageAdjustment = data.profileImageAdjustment }
      setVisitData({ ...visitDataCopy })
    })

    return () => {
      PubSub.unsubscribe(unsubToken)
    }
  }, [visitData])

  useEffect(() => {
    const unsubToken = PubSub.subscribe('set current tab', (msg, data) => {
      setCurrentTab(data)
    })

    return () => { PubSub.unsubscribe(unsubToken) }
  }, [])

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
        header={<Header titleHeader="Home" defaultTab="For you" currentTab={currentTab} tabsArray={["For you", "Following"]}/>}
        centerContent={[
          <NewTweetEntry />,
          <MainFeed currentTab={currentTab}></MainFeed>
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
          <Header defaultTab="Tweets" currentTab={currentTab} tabsArray={["Tweets", "Likes"]}/>,
          <ProfileFeed currentTab={currentTab}></ProfileFeed>
        ]}
        sidebarContent={[
          <SidebarWhoToFollow></SidebarWhoToFollow>
        ]}
        />
      </div>
    )
    : <LoadingPage logo={true}></LoadingPage>
  }

  if (props.current === 'visit-profile') {
    return visitData && visitFollowData && userContext
    ? (
      <VisitFollowContext.Provider value={visitFollowData}>
        <VisitContext.Provider value={visitData}>
          <div className="home-page">
            <PageLayout
            header={<ProfileHeader titleHeader={visitData.displayName} />}
            centerContent={[
              <VisitProfileDetails></VisitProfileDetails>,
              <Header defaultTab="Tweets" currentTab={currentTab} tabsArray={["Tweets", "Likes"]} ></Header>,
              userContext.isAdmin && <NewTweetEntry fakeUser={true}/>,
              pageDisplayed ? <ProfileFeed targetUserId={visitData.userId} currentTab={currentTab}></ProfileFeed> : false
            ]}
            sidebarContent={[
              <SidebarWhoToFollow></SidebarWhoToFollow>
            ]}
            />
          </div>
        </VisitContext.Provider>
      </VisitFollowContext.Provider>
    )
    : <LoadingPage logo={true}></LoadingPage>
  }
}

export default AppPage