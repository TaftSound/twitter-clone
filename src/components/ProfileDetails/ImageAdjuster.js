import { useEffect } from "react"
import { useState } from "react"
import { useRef } from "react"
import styled from "styled-components"
import { PRIMARY_COLOR } from "../constants"

import PopupModal from "../PopupModal/PopupModal"
import { FlexBox } from "../styled-components"
import { FormButton } from "../StyledButtons/FormButton"

const ApplyButton = styled(FormButton)`
  height: 32px;
  font-size: 15px;
`
const ImageContainer = styled(FlexBox)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 550px;
  overflow: hidden;
  user-select: none;
`
const Image = styled.img`
  position: absolute;
  top: calc(50% - 183.5px);
  ${props => `top: calc(50% + ${props.adjustedY}px);`}
  ${props => `left: calc(50% + ${props.adjustedX}px);`}
  transform: translate(-50%, -50%);
  width: 100%;
  user-select: none;
`
const ImageWindow = styled(FlexBox)`
  box-sizing: border-box;
  position: absolute;
  height: 183px;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  border: solid 4px ${PRIMARY_COLOR};
  box-shadow: rgba(18, 21, 23, 0.7) 0px 0px 0px 9999px;
  user-select: none; 
`
// STEPS
  // IMPLEMENT ZOOM SLIDER

const ImageAdjuster = (props) => {
  const windowRef = useRef(null)
  const imageRef = useRef(null)
  const containerRef = useRef(null)
  const availableX = useRef(0)
  const availableY = useRef(0)
  const lastAdjustedX = useRef(0)
  const lastAdjustedY = useRef(0)
  const [adjustedX, setAdjustedX] = useState(0)
  const [adjustedY, setAdjustedY] = useState(0)

  const setAvailableMovement = () => {
      const windowHeight = windowRef.current.offsetHeight
      const windowWidth = windowRef.current.offsetWidth
      const imageHeight = imageRef.current.offsetHeight
      const imageWidth = imageRef.current.offsetWidth
  
      availableX.current = (imageWidth - windowWidth) / 2
      availableY.current = (imageHeight - windowHeight) / 2
  }

  const setCurrentAdjustment = (moveCoordinates) => {
    if (moveCoordinates[0] >= availableX.current) {
      setAdjustedX(availableX.current)
    } else if (moveCoordinates[0] <= -availableX.current) {
      setAdjustedX(-availableX.current)
    } else {
      setAdjustedX(moveCoordinates[0])
    }

    if (moveCoordinates[1] >= availableY.current) {
      setAdjustedY(availableY.current)
    } else if (moveCoordinates[1] <= -availableY.current) {
      setAdjustedY(-availableY.current)
    } else {
      setAdjustedY(moveCoordinates[1])
    }
  }

  const setLastAdjusted = (moveCoordinates) => {
    if (moveCoordinates[0] >= availableX.current) {
      lastAdjustedX.current = availableX.current
    } else if (moveCoordinates[0] <= -availableX.current) {
      lastAdjustedX.current = -availableX.current
    } else {
      lastAdjustedX.current = moveCoordinates[0]
    }

    if (moveCoordinates[1] >= availableY.current) {
      lastAdjustedY.current = availableY.current
    } else if (moveCoordinates[1] <= -availableY.current) {
      lastAdjustedY.current = -availableY.current
    } else {
      lastAdjustedY.current = moveCoordinates[1]
    }
  }

  useEffect(() => {
    const container = containerRef.current
    const image = imageRef.current
    const startCoordinates = [0, 0]
    const moveCoordinates = [0, 0]


    const moveImage = (event) => {
      const lastX = lastAdjustedX.current
      const lastY = lastAdjustedY.current
      moveCoordinates[0] = event.screenX - startCoordinates[0] + lastX
      moveCoordinates[1] = event.screenY - startCoordinates[1] + lastY
      requestAnimationFrame(() => {
        setCurrentAdjustment(moveCoordinates)
      })
    }
    const startDrag = (event) => {
      startCoordinates[0] = event.screenX
      startCoordinates[1] = event.screenY
      document.addEventListener('mousemove', moveImage)
    }
    const endDrag = (event) => {
      setLastAdjusted(moveCoordinates)
      document.removeEventListener('mousemove', moveImage)
    }

    const onImageLoad = () => {
      setAvailableMovement()
      container.addEventListener('mousedown', startDrag)
      document.addEventListener('mouseup', endDrag)
    }

    image.addEventListener('load', onImageLoad)

    return () => {
      container.removeEventListener('mousedown', startDrag)
      document.removeEventListener('mouseup', endDrag)
      document.removeEventListener('mousemove', moveImage)
      image.removeEventListener('load', onImageLoad)
    }
  }, [])


  return (
    <PopupModal backFunction={props.backFunction}
                headerButton={<ApplyButton onClick={props.applyFunction}>Apply</ApplyButton>}
                height="90vh"
                maxHeight="650px"
                flexBox={true}
                title="Edit media">
      <FlexBox flex="1" direction="column" alignItems="center" justifyContent="center" position="relative">
        <ImageContainer ref={containerRef} direction="column" justifyContent="center" alignItems="center">
          <Image draggable={false} adjustedX={adjustedX} adjustedY={adjustedY} ref={imageRef} src={props.imageUrl}></Image>
          <ImageWindow ref={windowRef} display="flex"></ImageWindow>
        </ImageContainer>
      </FlexBox>
      <FlexBox height="40px" padding="4px 0px">

      </FlexBox>
    </PopupModal>
  )
}

export default ImageAdjuster