import { useState } from "react"
import styled from "styled-components"
import { LoadingContainer } from "../LoadingPage/LoadingPage"
import { CloseButton } from "../StyledButtons/CloseButton"
import { TRANSPARENT_DARK_GREY } from "../constants"

const ImageContainer = styled.div`
  box-sizing: border-box;
  ${props => !props.isLoaded && 'height: 380px;'}
  width: 100%;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 10px;
`
const Img = styled.img`
  width: 100%;
  display: block;
`
const ImgDeleteButton = styled(CloseButton)`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: ${TRANSPARENT_DARK_GREY};
  box-shadow: inset 0px 0px 0px 20px rgb(250, 250, 250, 0);
  transition: box-shadow ease-out 100ms;

  &:hover {
    background-color: ${TRANSPARENT_DARK_GREY};
    box-shadow: inset 0px 0px 0px 20px rgb(250, 250, 250, 0.2);
  }
`

const NewTweetImage = (props) => {
  const { index, imageUrl, removeImage } = props
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <ImageContainer isLoaded={isLoaded}>
      {!isLoaded && <LoadingContainer></LoadingContainer>}
      <Img onLoad={() => { setIsLoaded(true) }} src={imageUrl} alt="uploaded-image"></Img>
      {isLoaded && <ImgDeleteButton onClick={() => { removeImage(index) }}></ImgDeleteButton>}
    </ImageContainer>
  )
}

export default NewTweetImage