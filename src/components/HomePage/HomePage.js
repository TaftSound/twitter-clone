import { useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

import PageLayout from "../PageLayout/PageLayout"
import NewTweetEntry from "../NewTweetEntry/NewTweetEntry"
import Header from "../Header/Header"
import { useState } from "react"
import { getUserData } from "../../firestore"


const HomePage = (props) => {
  const [userName, setUserName] = useState('')
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user)
        setDisplayName(userData.displayName)
        setUserName(userData.userName)
      }
    }, [])
  })

  return (
    <div className="home-page">
      <PageLayout userName={userName} displayName={displayName} centerContent={[
        <Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following"]} />,
        <NewTweetEntry userName={userName} displayName={displayName} />
      ]}/>
    </div>
  )
}

export default HomePage