import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { getForYouFeed, getMainFeed } from "../../firestore/user-feed";
import LoadingPage from "../LoadingPage/LoadingPage";
import TweetDisplay from "../TweetDisplay/TweetDisplay";

const LoadingContainer = styled(LoadingPage)`
  height: 100px;
  width: 100%;
`

const MainFeed = (props) => {
  const [tweetFeed, setTweetFeed] = useState([])
  const [loadCount, setLoadCount] = useState(0)

  const newLoad = useRef(true)

  useEffect(() => { 
    if (!newLoad.current) { return }
    newLoad.current = false

    getForYouFeed(loadCount)
    // getMainFeed(loadCount)
    .then((newTweets) => {
      setTweetFeed((oldFeed) => { return [ ...oldFeed, ...newTweets ] })
    }).catch((error) => {
      console.log("Failure to fetch new tweets for feed:", error)
    })
  }, [loadCount])

  const triggerNextLoad = () => {
    const newCount = loadCount + 1
    newLoad.current = true
    setLoadCount(newCount)
  }
  
  return (
    tweetFeed[0]
    ? <>
    {tweetFeed.map((tweetData) => {
      return (
          <TweetDisplay key={tweetData.tweetId} tweetData={tweetData}></TweetDisplay>
      )
    })}
    </>
    : <LoadingContainer></LoadingContainer>
  )
}

export default MainFeed