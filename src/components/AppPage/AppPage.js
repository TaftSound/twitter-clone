
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
import { getFollowerList } from "../../firebase/firestore/follower-list-functions"
import { createContext } from "react"


export const VisitContext = createContext(null)
export const VisitFollowContext = createContext(null)

const AppPage = (props) => {
  const userContext = useContext(UserContext)

  const [pageDisplayed, setPageDisplayed] = useState(false)
  const [visitData, setVisitData] = useState(false)
  const [visitFollowData, setVisitFollowData] = useState(false)

  const location = useLocation()

  useEffect(() => {
    setVisitData(false)
    setVisitFollowData(false)

    const getVisitedUserData = async (userId) => {
      const userData = await getUserDataById(userId)
      const userFollowData = await getFollowerList(userId)
      setVisitData(userData)
      setVisitFollowData(userFollowData)
    }

    const locationSegments = location.pathname.split('/')
    if (locationSegments[1] === 'visit-profile') {
      const user = locationSegments[2]
      getVisitedUserData(user)
    }
  }, [location])

  const memoizedUserData = useMemo(() => {
    const userId = userContext ? userContext.userId : false
    return userId
  }, [userContext])

  useEffect(() => {
    memoizedUserData ? setPageDisplayed(true) : setPageDisplayed(false)
  }, [memoizedUserData])

  if (props.current === 'home' ) {
    sessionStorage.clear()
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
    sessionStorage.clear()
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

  if (props.current === 'visit-profile') {
    return visitData && visitFollowData
    ? (
      <VisitFollowContext.Provider value={visitFollowData}>
        <VisitContext.Provider value={visitData}>
          <div className="home-page">
            <PageLayout
            header={<ProfileHeader titleHeader={visitData.displayName} />}
            centerContent={[
              <VisitProfileDetails></VisitProfileDetails>,
              <Header defaultTab="Tweets" tabsArray={["Tweets", "Likes"]}></Header>,
              pageDisplayed ? <ProfileFeed targetUserId={visitData.userId}></ProfileFeed> : false
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