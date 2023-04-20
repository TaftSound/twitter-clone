import { useEffect } from "react";
import { getMainFeed } from "../../firestore/user-feed";
import TweetDisplay from "../TweetDisplay/TweetDisplay";

const MainFeed = (props) => {
  
  useEffect(() => {
    // What do I need to retrieve?
    // need to first retrieve user's "tweetReferences" document
    getMainFeed()
    // integrate "userFeed" array with "userTweets" array
    // sort combined array by timestamp
    // retrieve the first ten in chronological order
    // separate into render chunks of ten items, store the loadedCount in state
    // put a sentinal obsever between number 8 and 9
    // when sentinal enters view, load the next batch
    // TweetDisplay needs to sense when it is within view, and needs to write a view
  })
  
  return (
    <div></div>
  )
}

export default MainFeed