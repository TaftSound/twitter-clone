import styled from "styled-components"
import { BACKGROUND_COLOR, PRIMARY_COLOR } from "../constants"
import { TwitterLogo } from "../TwitterLogo"
import { LoadingCircle } from "../LoadingCircle"
import { useEffect, useState } from "react"

const PageContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: ${BACKGROUND_COLOR};
`
const BlueTwitterLogo = styled(TwitterLogo)`
  fill: ${PRIMARY_COLOR};
  height: 70px;
  width: 70px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const LoadingPage = (props) => {
  const [logoDisplayed, setLogoDisplayed] = useState(true)

  const startLoadingAnimation = () => { setLogoDisplayed(false) }

  useEffect(() => {
    setLogoDisplayed(true)
    setTimeout(startLoadingAnimation, 100)
  }, [])

  return (
    <PageContainer>
      {logoDisplayed 
      ? <BlueTwitterLogo></BlueTwitterLogo>
      : <LoadingCircle></LoadingCircle>}
    </PageContainer>
  )
}

export default LoadingPage