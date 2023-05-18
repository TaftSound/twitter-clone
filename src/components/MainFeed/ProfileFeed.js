import { useEffect, useContext, useState, useRef } from "react"
import PubSub from "pubsub-js"

import { FlexBox } from "../styled-components"
import TweetDisplay from "../TweetDisplay/TweetDisplay"
import { UserContext } from "../../App"
import { LoadingContainer } from "../LoadingPage/LoadingPage"

import { getLikedTweets, getUserTweets } from "../../firebase/firestore/user-feed"

const ProfileFeed = (props) => {
  const userContext = useContext(UserContext)
  const [tweetsFeed, setTweetsFeed] = useState([])
  const [hasLoaded, setHasLoaded] = useState(false)
  const { targetUserId } = props

  const loadCount = useRef(0)
  const sentinelRef = useRef(null)
  const observer = useRef(null)

  useEffect(() => {
    if (!props.currentTab) { return }

    loadCount.current = 0
    setTweetsFeed([])
    setHasLoaded(false)

    const loadTweets = async () => {
      try {
        setHasLoaded(false)
        observer.current.disconnect()
        const userId = targetUserId ? targetUserId : userContext.userId
        const newTweets = props.currentTab === "Tweets"
        ? await getUserTweets(userId, loadCount.current)
        : props.currentTab === "Likes"
        ? await getLikedTweets(userId, loadCount.current)
        : []
        setHasLoaded(true)
        if (!newTweets[0]) { return }
        setTweetsFeed((loadedTweets) => {
          return [...loadedTweets, ...newTweets]
        })
        loadCount.current = loadCount.current + 1
        if (newTweets.length < 5) { return }
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

    return () => { observer.current.disconnect() }
  }, [targetUserId, props.currentTab])
  
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