import { useEffect } from "react"
import { useCallback } from "react"
import { useState } from "react"
import { useRef } from "react"
import styled from "styled-components"
import { PRIMARY_COLOR, PRIMARY_COLOR_LIGHT } from "../constants"

import PopupModal from "../PopupModal/PopupModal"
import { FlexBox, SmallGreyLogo } from "../styled-components"
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
  width: 100%;
  overflow: hidden;
  user-select: none;
`
const Image = styled.img`
  position: absolute;
  ${props => `top: calc(50% + ${props.adjustedY}px);`}
  ${props => `left: calc(50% + ${props.adjustedX}px);`}
  transform: translate(-50%, -50%);
  ${props => `width: ${props.width}px;`}
  ${props => props.zoom && `width: ${props.zoom * props.width}px;`}
  user-select: none;
`
const ImageWindow = styled(FlexBox)`
  box-sizing: border-box;
  position: absolute;
  ${props => `height: ${props.height}px;`}
  ${props => `width: ${props.width}px;`}
  top: 50%;
  transform: translateY(-50%);
  border: solid 4px ${PRIMARY_COLOR};
  box-shadow: rgba(18, 21, 23, 0.7) 0px 0px 0px 9999px;
  user-select: none; 
`

const Label = styled.label`
  position: absolute;
  left: -99999px;
`
const HtmlSlider = styled.input.attrs(props => ({
  type: props.type ||  'range',
  min: props.min || 1,
  max: props.max || 5,
  step: props.step || 0.01
}))`
    position: absolute;
    left: -99999px;
`
const SliderTrack = styled.div`
  position: relative;
  width: 300px;
  height: 4px;
  background-color: ${PRIMARY_COLOR_LIGHT};
  border-radius: 50px;
`
const SliderThumb = styled.div`
  position: absolute;
  left: 0px;
  ${props => `left: ${props.thumbX}px;`}
  top: 50%;
  transform: translateY(-50%);
  height: 16px;
  width: 16px;
  margin: 0px -2.5px;
  background-color: ${PRIMARY_COLOR};
  border-radius: 50px;
`
const ZoomSlider = (props) => {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const trackWidth = useRef(null)
  const clickStartX = useRef(null)
  const movedX = useRef(null)
  const lastX = useRef(0)
  const [value, setValue] = useState(1)
  const [thumbX, setThumbX] = useState(0)

  const interpolateValue = (inputValue) => {
    const outputMin = 1;
    const outputMax = 5;
  
    const interpolatedValue = Math.pow((outputMax / outputMin), inputValue) * outputMin;
  
    return interpolatedValue.toFixed(2);
  };

  useEffect(() => {
    const sliderTrack = trackRef.current
    const thumb = thumbRef.current

    const moveSlider = (event) => {
      const newX = event.screenX;
      movedX.current = newX - clickStartX.current + lastX.current
      if (movedX.current >= trackWidth.current) { movedX.current = trackWidth.current }
      if (movedX.current <= 0) { movedX.current = 0 }
      const movePercentage = movedX.current / trackWidth.current
      const zoomValue = interpolateValue(movePercentage)
      
      requestAnimationFrame(() => {
        props.changeZoom(zoomValue)
        setValue(zoomValue)
        setThumbX(movedX.current)
      })
    }
    const startSlide = (event) => {
      clickStartX.current = event.screenX
      document.addEventListener('mousemove', moveSlider)
    }
    const endSlide = (event) => {
      lastX.current = movedX.current
      document.removeEventListener('mousemove', moveSlider)
    }

    thumb.addEventListener('mousedown', startSlide)
    document.addEventListener('mouseup', endSlide)

    return () => {
      thumb.removeEventListener('mousedown', startSlide)
      document.removeEventListener('mouseup', endSlide)
    }
  }, [])

  useEffect(() => {
    if (trackRef.current) { trackWidth.current = trackRef.current.offsetWidth }
  }, [])

  const moveHtmlSlider = (event) => {
    setValue(event.target.value)
    props.changeZoom(event.target.value)
  }

  return (
    <FlexBox position="relative">
      <Label htmlFor="zoom-slider">Zoom Slider</Label>
      <HtmlSlider name="zoom-slider" onChange={moveHtmlSlider} value={value}></HtmlSlider>
      <SliderTrack ref={trackRef}>
        <SliderThumb thumbX={thumbX} ref={thumbRef}></SliderThumb>
      </SliderTrack>
    </FlexBox>
  )
}

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
  const [zoom, setZoom] = useState(1)
  const [imageLoaded, setImageLoaded] = useState(false)

  const setAvailableMovement = useCallback(() => {
      const windowHeight = windowRef.current.offsetHeight
      const windowWidth = windowRef.current.offsetWidth
      const imageHeight = imageRef.current.offsetHeight
      const imageWidth = imageRef.current.offsetWidth
  
      availableX.current = (imageWidth - windowWidth) / 2
      availableY.current = (imageHeight - windowHeight) / 2
  }, [])

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
    if (!imageLoaded) { return }
  
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

    container.addEventListener('mousedown', startDrag)
    document.addEventListener('mouseup', endDrag)
    image.addEventListener('load', onImageLoad)

    return () => {
      container.removeEventListener('mousedown', startDrag)
      document.removeEventListener('mouseup', endDrag)
      document.removeEventListener('mousemove', moveImage)
      image.removeEventListener('load', onImageLoad)
    }
  }, [setAvailableMovement, imageLoaded])

  useEffect(() => {
    if (!imageLoaded) { return }
    setAvailableMovement()
    setCurrentAdjustment([lastAdjustedX.current, lastAdjustedY.current])
  }, [setAvailableMovement, zoom, imageLoaded])

  const changeImageZoom = (value) => {
    const newZoom = value
    requestAnimationFrame(() => {
      setZoom(newZoom)
    })
  }

  const applyChanges = () => {
    const imageWidth = imageRef.current.offsetWidth
    const imageHeight = imageRef.current.offsetHeight

    const transformX = ((adjustedX / imageWidth).toFixed(2) * 100)
    const transformY = ((adjustedY / imageHeight).toFixed(2) * 100)

    const changesObject = {
      zoom: zoom,
      transformX: transformX,
      transformY: transformY,
    }
    props.applyFunction(changesObject)
  }

  const onImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <PopupModal backFunction={props.backFunction}
                headerButton={<ApplyButton onClick={applyChanges}>Apply</ApplyButton>}
                height="90vh"
                maxHeight="650px"
                flexBox={true}
                title="Edit media">
      <FlexBox flex="1" direction="column" alignItems="center" justifyContent="center" position="relative">
        <ImageContainer ref={containerRef} direction="column" justifyContent="center" alignItems="center">
          <Image onLoad={onImageLoad} width={props.windowWidth} zoom={zoom} draggable={false} adjustedX={adjustedX} adjustedY={adjustedY} ref={imageRef} src={props.imageUrl}></Image>
          <ImageWindow width={props.windowWidth} height={props.windowHeight} ref={windowRef} display="flex"></ImageWindow>
        </ImageContainer>
      </FlexBox>
      <FlexBox height="40px" padding="4px 0px" justifyContent="center" alignItems="center" gap="12px">
        <SmallGreyLogo path="M11 4c-3.87 0-7 3.13-7 7s3.13 7 7 7c1.93 0 3.68-.78 4.95-2.05C17.21 14.68 18 12.93 18 11c0-3.87-3.14-7-7-7zm-9 7c0-4.97 4.03-9 9-9s9 4.03 9 9c0 2.12-.74 4.08-1.97 5.62l3.68 3.67-1.42 1.42-3.67-3.68C15.08 19.26 13.12 20 11 20c-4.97 0-9-4.03-9-9zm12.5 1h-7v-2h7v2z"></SmallGreyLogo>
        <ZoomSlider changeZoom={changeImageZoom} currentZoom={zoom}></ZoomSlider>
        <SmallGreyLogo path="M11 4c-3.87 0-7 3.13-7 7s3.13 7 7 7c1.93 0 3.68-.78 4.95-2.05C17.21 14.68 18 12.93 18 11c0-3.87-3.14-7-7-7zm-9 7c0-4.97 4.03-9 9-9s9 4.03 9 9c0 2.12-.74 4.08-1.97 5.62l3.68 3.67-1.42 1.42-3.67-3.68C15.08 19.26 13.12 20 11 20c-4.97 0-9-4.03-9-9zm8-1V7.5h2V10h2.5v2H12v2.5h-2V12H7.5v-2H10z"></SmallGreyLogo>
      </FlexBox>
    </PopupModal>
  )
}

export default ImageAdjuster