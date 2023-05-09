import { useEffect } from "react"
import { useState } from "react"
import { FlexBox } from "../styled-components"
import TweetDisplay from "../TweetDisplay/TweetDisplay"
import PubSub from "pubsub-js"
import styled from "styled-components"
import { getLikedTweets, getUserTweets } from "../../firebase/firestore/user-feed"
import { useContext } from "react"
import { UserContext } from "../../App"
import { useRef } from "react"
import { LoadingContainer } from "../LoadingPage/LoadingPage"


const ProfileFeed = (props) => {
  const userContext = useContext(UserContext)
  const [tweetsFeed, setTweetsFeed] = useState([])
  const [currentTab, setCurrentTab] = useState("Tweets")
  const [hasLoaded, setHasLoaded] = useState(false)
  const { targetUserId } = props

  const loadCount = useRef(0)
  const sentinelRef = useRef(null)
  const observer = useRef(null)
  
  useEffect(() => {
    const tabChangeToken = PubSub.subscribe('set current tab', (msg, data) => {
      setCurrentTab(data)
    })

    return () => {
      PubSub.unsubscribe(tabChangeToken)
    }
  }, [])

  useEffect(() => {
    loadCount.current = 0
    setTweetsFeed([])
    setHasLoaded(false)

    const loadTweets = async () => {
      try {
        setHasLoaded(false)
        observer.current.disconnect()
        const userId = targetUserId ? targetUserId : userContext.userId
        const newTweets = currentTab === "Tweets"
        ? await getUserTweets(userId, loadCount.current)
        : currentTab === "Likes"
        ? await getLikedTweets(userId)
        : []
        setHasLoaded(true)
        if (!newTweets[0]) { return }
        setTweetsFeed((loadedTweets) => {
          return [...loadedTweets, ...newTweets]
        })
        loadCount.current = loadCount.current + 1
        
        if (sentinelRef.current) observer.current.observe(sentinelRef.current)
      } catch (error) {
        console.error("Failure to retrieve tweet feed:", error)
      }
    }

    observer.current = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        await loadTweets()
        console.log('run')
      }
    }, {threshold: 1})

    if (sentinelRef.current) { observer.current.observe(sentinelRef.current) }

    return () => { observer.current.disconnect() }
  }, [currentTab, targetUserId, userContext.userId])
  
  return (
    <>
      <FlexBox direction="column">
        {tweetsFeed[0] && tweetsFeed.map((tweetData) => {
          return <TweetDisplay key={tweetData.tweetId} tweetData={tweetData}></TweetDisplay>
        })}
      </FlexBox>
      <div ref={sentinelRef}></div>
      {hasLoaded ? '' : <LoadingContainer></LoadingContainer>}
    </>
  )
}

export default ProfileFeed