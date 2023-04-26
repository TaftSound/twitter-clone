import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { getForYouFeed, getFollowingFeed } from "../../firestore/user-feed";
import LoadingPage from "../LoadingPage/LoadingPage";
import TweetDisplay from "../TweetDisplay/TweetDisplay";
import PubSub from "pubsub-js";
import WhoToFollow from "../WhoToFollow/WhoToFollow";
import { getUsersToFollow } from "../../firestore/follower-list-functions";

const LoadingContainer = styled(LoadingPage)`
  height: 100px;
  width: 100%;
`

const MainFeed = (props) => {
  const [tweetFeed, setTweetFeed] = useState([])
  const [whoToFollowFeed, setWhoToFollowFeed] = useState([])
  const [hasLoaded, setHasLoaded] = useState(false)
  const [currentTab, setCurrentTab] = useState("For you")
  
  const sentinelRef = useRef(null)
  const observer = useRef(null)
  const loadCount = useRef(0)

  useEffect(() => {
    const reloadFeed = () => {
      loadCount.current = 0
      observer.current.observe(sentinelRef.current)
      setTweetFeed([])
    }

    const feedResetToken = PubSub.subscribe('reload feed', () => {
      reloadFeed()
    })

    const tabChangeToken = PubSub.subscribe('set current tab', (msg, data) => {
      setCurrentTab(data)
      reloadFeed()
    })

    return () => {
      PubSub.unsubscribe(tabChangeToken)
      PubSub.unsubscribe(feedResetToken)
    }
  }, [])

  useEffect(() => { 
    const loadUsersToFollow = async (loadCount) => {
      const newUserData = await getUsersToFollow(loadCount)
      setWhoToFollowFeed((oldFeed) => {
        return [...oldFeed, newUserData]
      })
    }

    const startLoadCycle = async () => {
      console.log('start tweet load')
      setHasLoaded(false)
      observer.current.disconnect()
      return currentTab === "For you"
      ? await getForYouFeed(loadCount.current)
      : await getFollowingFeed(loadCount.current)
    }
  
    const finishLoadCycle = (newTweets) => {
      setHasLoaded(true)
      if (!newTweets[0]) { return }
      loadUsersToFollow(loadCount.current)
      loadCount.current = loadCount.current + 1
      setTweetFeed((oldFeed) => { return [ ...oldFeed, ...newTweets ] })
      if (sentinelRef.current) observer.current.observe(sentinelRef.current)
    }

    observer.current = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        startLoadCycle(observer)
        .then((newTweets) => { finishLoadCycle(newTweets) })
        .catch((error) => {
          console.log("Failure to fetch new tweets for feed:", error)
        })
      }
    }, {threshold: 1})

    if (sentinelRef.current) { observer.current.observe(sentinelRef.current) }

    return () => { observer.current.disconnect() }
  }, [currentTab])

  const isWhoToFollowPlacement = (index) => {
    if (index !== 0 
        && (index + 1) % 5 === 0
        && currentTab === "For you") {
      return true
    } else {
      return false
    }
  }
  
  
  return (
    <>
    {tweetFeed.map((tweetData, index) => {
      if (isWhoToFollowPlacement(index) && whoToFollowFeed[0]) { 
        return (
          <div key={tweetData.tweetId}>
            <TweetDisplay tweetData={tweetData}></TweetDisplay>
            <WhoToFollow mainFeed={true} userData={whoToFollowFeed[(index + 1) / 5 - 1]}></WhoToFollow>
          </div>
        )
      }
      return (
        <TweetDisplay key={tweetData.tweetId} tweetData={tweetData}></TweetDisplay>
      )
    })}
    {hasLoaded ? '' : <LoadingContainer></LoadingContainer>}
    <div ref={sentinelRef}>herro</div>
    </>
  )
}

export default MainFeed