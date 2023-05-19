import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import PubSub from "pubsub-js";
import { getForYouFeed, getFollowingFeed } from "../../firebase/firestore/user-feed";
import { getUsersToFollow } from "../../firebase/firestore/follower-list-functions";
import { LoadingContainer } from "../LoadingPage/LoadingPage";
import TweetDisplay from "../TweetDisplay/TweetDisplay";
import WhoToFollow from "../WhoToFollow/WhoToFollow";

import { useContext } from "react";
import { UserContext } from "../../App";
import { useLocation } from "react-router-dom";
import { deepEqual } from "../../deep-equal";

const CenterWhoToFollow = styled(WhoToFollow)`
  display: block;
  visibility: visible;

  @media (min-width: 988px) {
    display: none;
    visibility: hidden;
  }
`

const MainFeed = (props) => {
  const [tweetFeed, setTweetFeed] = useState([])
  const [whoToFollowFeed, setWhoToFollowFeed] = useState([])
  const [hasLoaded, setHasLoaded] = useState(false)

  const userContext = useContext(UserContext)
  
  const sentinelRef = useRef(null)
  const observer = useRef(null)
  const loadCount = useRef(0)
  const guestTweetsRef = useRef(false)
  const lastContextRef = useRef(null)

  const hasUserInfoChanged = () => {
    if (deepEqual(userContext, lastContextRef.current)) {
      return false
    } else {
      lastContextRef.current = userContext
      return true
    }
  }

  useEffect(() => {
    if (!hasUserInfoChanged()) { return }

    const userData = {
      userId: userContext.userId,
      userName: userContext.userName,
      displayName: userContext.displayName,
      profileImageUrl: userContext.profileImageUrl,
      profileImageAdjustment: userContext.profileImageAdjustment,
    }

    if (!userContext || !userContext.guest) { return }
    const guestTweets = userContext.tweets
      ? Object.entries(userContext.tweets)
      : false
    
    const formattedGuestTweets = guestTweets.map((tweetEntry) => {
      const tweetContent = tweetEntry[1]
      tweetContent.tweetId = tweetEntry[0]
      const tweet = { ...tweetContent, ...userData }
      return tweet
    })

    formattedGuestTweets.sort((a, b) => { return b.timestamp - a.timestamp })

    guestTweetsRef.current = formattedGuestTweets
  }, [userContext])

  useEffect(() => {
    if (!props.currentTab) { return }

    loadCount.current = 0
    setTweetFeed([])
    setWhoToFollowFeed([])

    const loadUsersToFollow = async (loadCount) => {
      const newUserData = userContext.guest
      ? await getUsersToFollow(loadCount, 3, userContext.followData)
      : await getUsersToFollow(loadCount, 3)
      setWhoToFollowFeed((oldFeed) => {
        return [...oldFeed, newUserData]
      })
    }

    const startLoadCycle = async () => {
      setHasLoaded(false)
      observer.current.disconnect()
      return props.currentTab === "For you"
      ? await getForYouFeed(loadCount.current)
      : await getFollowingFeed(loadCount.current)
    }
  
    const finishLoadCycle = async (newTweets) => {
      setHasLoaded(true)
      if (!newTweets[0]) {
        if (guestTweetsRef.current[0]) {
          const finalGuestTweets = guestTweetsRef.current
          guestTweetsRef.current = false
          setTweetFeed((oldFeed) => { return [ ...oldFeed, ...finalGuestTweets ] })
        }
        return
      }
      if (props.currentTab === "Following" && userContext.guest) {
        const firstTimestamp = newTweets[newTweets.length - 1].timestamp
        if (guestTweetsRef.current[0]) {
          const userTweets = guestTweetsRef.current
          for (let i = userTweets.length - 1; i >= 0; i--) {
            if (userTweets[i].timestamp > firstTimestamp) {
              const tweet = userTweets.splice(i, 1)[0]
              newTweets.push(tweet)
            }
          }
          guestTweetsRef.current = userTweets
        }
        newTweets.sort((a, b) => { return b.timestamp - a.timestamp })
      }
      setTweetFeed((oldFeed) => { return [ ...oldFeed, ...newTweets ] })
      if (props.currentTab === "For you") { await loadUsersToFollow(loadCount.current) }
      loadCount.current = loadCount.current + 1
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
  }, [props.currentTab])

  const isWhoToFollowPlacement = (index) => {
    if (index !== 0 
        && (index + 1) % 5 === 0
        && props.currentTab === "For you") {
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
            <CenterWhoToFollow mainFeed={true} userData={whoToFollowFeed[(index + 1) / 5 - 1]}></CenterWhoToFollow>
          </div>
        )
      }
      return (
        <TweetDisplay key={tweetData.tweetId} tweetData={tweetData}></TweetDisplay>
      )
    })}
    <div ref={sentinelRef}></div>
    {hasLoaded ? '' : <LoadingContainer></LoadingContainer>}
    </>
  )
}

export default MainFeed