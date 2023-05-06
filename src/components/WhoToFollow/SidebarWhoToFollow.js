import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { getUsersToFollow } from "../../firebase/firestore/follower-list-functions";

import WhoToFollow from "./WhoToFollow";

const SidebarWhoToFollow = (props) => {
  const [usersToFollow, setUsersToFollow] = useState([])
  const [loadCount, setLoadCount] = useState(0)

  useEffect(() => {
    const loadUsersToFollow = async () => {
      const usersOne = await getUsersToFollow(0)
      const usersTwo = await getUsersToFollow(1)
      const usersThree = await getUsersToFollow(2)
      const usersArray = [usersOne, usersTwo, usersThree]

      setUsersToFollow(usersArray)
    }

    loadUsersToFollow()
  }, [])

  
  return (
    <>
      [{usersToFollow[0] && <WhoToFollow userData={usersToFollow[0]}></WhoToFollow>},
      {usersToFollow[1] && <WhoToFollow userData={usersToFollow[1]}></WhoToFollow>},
      {usersToFollow[2] && <WhoToFollow userData={usersToFollow[2]}></WhoToFollow>}]
    </>
  )
}

export default SidebarWhoToFollow