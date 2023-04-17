import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

import PageLayout from "../PageLayout/PageLayout"
import NewTweetEntry from "../NewTweetEntry/NewTweetEntry"
import Header from "../Header/Header"


const HomePage = (props) => {

  const navigate = useNavigate()

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('logged out')
        navigate('/')
      }
    }, [])
  })

  return (
    <div className="home-page">
      <PageLayout userName="Guest" centerContent={[
        <Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following"]} />,
        <NewTweetEntry userName="Guest"/>
      ]}/>
    </div>
  )
}

export default HomePage