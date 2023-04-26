import { useState } from "react";
import styled from "styled-components";

import WhoToFollow from "./WhoToFollow";

const WhoToFollowFeed = (props) => {
  const [usersToFollow, setUsersToFollow] = useState([])
  const [loadCount, setLoadCount] = useState(0)

  // Need to get users in chunks of two
  // Need to get two immediately on first load
  // if only one left, display only one in that chunk
  // in the main feed, display them separated, how to do this?
    // pass in whoToFollowCount
    // increase whoToFollowCount every time new tweets load
    // add WhoToFollow element to the tweet feed every time one loads

  
  return (
    <div></div>
  )
}

export default WhoToFollowFeed