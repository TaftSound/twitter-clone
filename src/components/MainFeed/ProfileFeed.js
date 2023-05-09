import { useEffect } from "react"
import { useState } from "react"
import { FlexBox } from "../styled-components"
import TweetDisplay from "../TweetDisplay/TweetDisplay"
import PubSub from "pubsub-js"
import styled from "styled-components"
import { getUserTweets } from "../../firebase/firestore/user-feed"
import { useContext } from "react"
import { UserContext } from "../../App"
import { useRef } from "react"


const ProfileFeed = (props) => {
  const userContext = useContext(UserContext)
  const [tweetsFeed, setTweetsFeed] = useState([])
  const [currentTab, setCurrentTab] = useState("Tweets")
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

    const loadTweets = async () => {
      try {
        observer.current.disconnect()
        const userId = targetUserId ? targetUserId : userContext.userId
        const newTweets = await getUserTweets(userId, loadCount.current)
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
      }
    }, {threshold: 1})

    if (sentinelRef.current) { observer.current.observe(sentinelRef.current) }

  }, [currentTab, targetUserId, userContext.userId])
  
  return (
    <>
      <FlexBox direction="column">
        {tweetsFeed[0] && tweetsFeed.map((tweetData) => {
          return <TweetDisplay key={tweetData.tweetId} tweetData={tweetData}></TweetDisplay>
        })}
      </FlexBox>
      <div ref={sentinelRef}></div>
    </>
  )
}

export default ProfileFeed