import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { getForYouFeed, getFollowingFeed } from "../../firestore/user-feed";
import LoadingPage from "../LoadingPage/LoadingPage";
import TweetDisplay from "../TweetDisplay/TweetDisplay";

const LoadingContainer = styled(LoadingPage)`
  height: 100px;
  width: 100%;
`

const MainFeed = (props) => {
  const [tweetFeed, setTweetFeed] = useState([])
  const [hasLoaded, setHasLoaded] = useState(false)
  
  const sentinelRef = useRef(null)
  const loadCount = useRef(0)

  const startLoadCycle = async (observer) => {
    setHasLoaded(false)
    observer.disconnect()
    return await getForYouFeed(loadCount.current)
    // getMainFeed(loadCount)
  }

  const finishLoadCycle = (newTweets, observer) => {
    setHasLoaded(true)
    if (!newTweets[0]) { return }
    loadCount.current = loadCount.current + 1
    setTweetFeed((oldFeed) => { return [ ...oldFeed, ...newTweets ] })
    observer.observe(sentinelRef.current)
  } 

  useEffect(() => { 
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        startLoadCycle(observer)
        .then((newTweets) => { finishLoadCycle(newTweets, observer) })
        .catch((error) => {
          console.log("Failure to fetch new tweets for feed:", error)
        })
      }
    }, {threshold: 1})

    if (sentinelRef.current) { observer.observe(sentinelRef.current) }

    return () => { observer.disconnect() }
  }, [])
  
  return (
    <>
    {tweetFeed.map((tweetData) => {
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