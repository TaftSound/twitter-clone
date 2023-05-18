import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { UserContext } from "../../App";
import { getUsersToFollow } from "../../firebase/firestore/follower-list-functions";

import WhoToFollow from "./WhoToFollow";

const SidebarWhoToFollow = (props) => {
  const userContext = useContext(UserContext)
  const [usersToFollow, setUsersToFollow] = useState([])
  const [loadCount, setLoadCount] = useState(0)

  useEffect(() => {
    const loadUsersToFollow = async () => {
      const guestFollowData = userContext.guest 
      ? userContext.followData
      : false
      
      const usersOne = await getUsersToFollow(0, 2, guestFollowData)
      const usersTwo = await getUsersToFollow(1, 2, guestFollowData)
      const usersThree = await getUsersToFollow(2, 2, guestFollowData)
      const usersArray = [usersOne, usersTwo, usersThree]

      setUsersToFollow(usersArray)
    }

    if (userContext) loadUsersToFollow()
  }, [userContext])

  
  return (
    <>
      [{usersToFollow[0] && <WhoToFollow userData={usersToFollow[0]}></WhoToFollow>},
      {usersToFollow[1] && <WhoToFollow userData={usersToFollow[1]}></WhoToFollow>},
      {usersToFollow[2] && <WhoToFollow userData={usersToFollow[2]}></WhoToFollow>}]
    </>
  )
}

export default SidebarWhoToFollow