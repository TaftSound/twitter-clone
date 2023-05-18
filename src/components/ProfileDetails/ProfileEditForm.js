import styled from "styled-components"
import PubSub from "pubsub-js"
import { useEffect, useState } from "react"

import { updateUserProfile } from "../../firebase/firestore/user-functions"

import DynamicFormInput from "../DynamicFormInput"
import PopupModal from "../PopupModal/PopupModal"
import { FlexBox, UserCircle } from "../styled-components"
import { FormButton } from "../StyledButtons/FormButton"
import { SmallMenuButton } from "../StyledButtons/SmallMenuButton"
import { useRef } from "react"
import ImageAdjuster from "./ImageAdjuster"
import { BACKGROUND_COLOR, IMAGE_OVERLAY_GREY, TRANSPARENT_DARK_GREY } from "../constants"
import { useContext } from "react"
import { UserContext } from "../../App"
import { VisitContext } from "../AppPage/AppPage"

const SaveButton = styled(FormButton)`
  height: 32px;
  font-size: 15px;
`

const BannerImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${props => `transform: translate(${-50 + props.transformX}%, ${-50 + props.transformY}%);` }
  box-sizing: border-box;
  width: 100%;
  ${props => `width: ${props.zoom * 100}%;`}
  border: solid 2px ${BACKGROUND_COLOR};
`
const ProfileImage = styled(BannerImage)`
  border: none;
`

const LargeUserCircle = styled(UserCircle)`
  box-sizing: content-box;
  padding: 0px;
  height: 112px;
  width: 112px;
  font-size: 60px;
  border: solid 4px ${BACKGROUND_COLOR};
  position: relative;
  overflow: hidden;
  opacity: ${props => props.imageLoaded ? '100%' : '70%'};
`

const EditButton = styled(SmallMenuButton)`
  height: 44px;
  width: 44px;
  background-color: ${TRANSPARENT_DARK_GREY};
  opacity: 80%;
  transition: background-color 200ms;
  
  &:hover {
    background-color: rgb(35, 40, 45, 0.75);
  }
`

const ImageUploadButton = (props) => {
  const inputRef = useRef(null)

  const getImage = (event) => {
    props.uploadImage(event.target.files[0])
    event.target.value = ''
  }

  const clickInput = () => {
    inputRef.current.click()
  }

  return (
    <>
      <FlexBox position="absolute" left="-9999px"><input ref={inputRef} type="file" accept="image/*" onChange={getImage} aria-label="user image upload"></input></FlexBox>
      <EditButton title='Add photo' onClick={clickInput} medium={true} path="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z" />
    </>
  )
}

const DeleteImageButton = (props) => {
  return (
    <EditButton title="Remove photo" onClick={props.onClick} medium={true} path="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></EditButton>
  )
}


const ProfileEditForm = (props) => {
  const userContext = useContext(UserContext)
  const visitContext = useContext(VisitContext)

  const [savedUserData, setSavedUserData] = useState(userContext)
  const [nameValue, setNameValue] = useState('')
  const [bioValue, setBioValue] = useState('')
  const [bannerImageFile, setBannerImageFile] = useState(false)
  const [bannerImageUrl, setBannerImageUrl] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState(false)
  const [bannerImageAdjuster, setBannerImageAdjuster] = useState(false)
  const [profileImageAdjuster, setProfileImageAdjuster] = useState(false)
  const [bannerImageAdjustment, setBannerImageAdjustment] = useState({
    transformX: 0,
    transformY: 0,
    zoom: 1
  })
  const [profileImageAdjustment, setProfileImageAdjustment] = useState({
    transformX: 0,
    transformY: 0,
    zoom: 1
  })

  useEffect(() => {
    if (props.visit) {
      setSavedUserData(visitContext)
    } else {
      setSavedUserData(userContext)
    }
  }, [userContext, visitContext, props.visit])

  const changeNameValue = (event) => {
    const newValue = event.target.value
    setNameValue(newValue)
  }
  const changeBioValue = (event) => {
    const newValue = event.target.value
    setBioValue(newValue)
  }

  useEffect(() => {
    savedUserData.displayName ? setNameValue(savedUserData.displayName) : setNameValue('')
    savedUserData.bio ? setBioValue(savedUserData.bio) : setBioValue('')
    savedUserData.bannerImageUrl ? setBannerImageUrl(savedUserData.bannerImageUrl) : setBannerImageUrl(false)
    savedUserData.profileImageUrl ? setProfileImageUrl(savedUserData.profileImageUrl) : setProfileImageUrl(false)
    savedUserData.bannerImageAdjustment ? setBannerImageAdjustment(savedUserData.bannerImageAdjustment)
    : setBannerImageAdjustment({
      transformX: 0,
      transformY: 0,
      zoom: 1})
    savedUserData.profileImageAdjustment ? setProfileImageAdjustment(savedUserData.profileImageAdjustment)
    : setProfileImageAdjustment({
      transformX: 0,
      transformY: 0,
      zoom: 1})
  }, [savedUserData])

  const updateUserInfo = async () => {
    try {
      const newProfileData = {}
      if (nameValue !== savedUserData.displayName) { newProfileData.displayName = nameValue }
      if (bioValue !== savedUserData.bio) { newProfileData.bio = bioValue }
      if (bannerImageUrl !== savedUserData.bannerImageUrl) {
        newProfileData.bannerImageUrl = bannerImageUrl
        newProfileData.bannerImageFile = bannerImageFile
      }
      if (profileImageUrl !== savedUserData.profileImageUrl) {
        newProfileData.profileImageUrl = profileImageUrl
        newProfileData.profileImageFile = profileImageFile
      }
      if (bannerImageAdjustment !== savedUserData.bannerImageAdjustment) {
        newProfileData.bannerImageAdjustment = bannerImageAdjustment
      }
      if (profileImageAdjustment !== savedUserData.profileImageAdjustment) {
        newProfileData.profileImageAdjustment = profileImageAdjustment
      }
      await updateUserProfile(newProfileData, savedUserData.userId)
      if (!props.visit) {
        PubSub.publish('update user data', newProfileData)
      } else {
        PubSub.publish('update visit data', newProfileData)
      }
      props.finishProfileEdit()
    } catch (error) {
      console.error("Failure to update profile info", error)
    }
  }

  const uploadBannerImage = async (imgFile) => {
    const imgUrl = URL.createObjectURL(imgFile)
    setBannerImageFile(imgFile)
    setBannerImageUrl(imgUrl)
    setBannerImageAdjuster(true)
  }
  const applyBannerAdjustment = async (bannerDisplayData) => {
    setBannerImageAdjustment(bannerDisplayData)
    setBannerImageAdjuster(false)
  }
  const uploadProfileImage = async (imgFile) => {
    const imgUrl = URL.createObjectURL(imgFile)
    setProfileImageFile(imgFile)
    setProfileImageUrl(imgUrl)
    setProfileImageAdjuster(true)
  }
  const applyProfileImageAdjustment = async (profileDisplayData) => {
    setProfileImageAdjustment(profileDisplayData)
    setProfileImageAdjuster(false)
  }
  const hideImageAdjuster = () => {
    setBannerImageAdjuster(false)
    setProfileImageAdjuster(false)
  }
  const deleteBannerImage = () => {
    setBannerImageUrl(false)
    setBannerImageFile(false)
    setBannerImageAdjustment({})
  }

  if (bannerImageAdjuster && bannerImageUrl) {
    return (
      <ImageAdjuster applyFunction={applyBannerAdjustment} 
                     backFunction={hideImageAdjuster}
                     imageUrl={bannerImageUrl}
                     windowWidth={550}
                     windowHeight={183} />
    )
  }
  if (profileImageAdjuster && profileImageUrl) {
    return (
      <ImageAdjuster applyFunction={applyProfileImageAdjustment}
                     backFunction={hideImageAdjuster}
                     imageUrl={profileImageUrl}
                     windowWidth={389}
                     windowHeight={389} />
    )
  }
  
  return (
    <PopupModal removePopup={props.finishProfileEdit}
                headerButton={<SaveButton onClick={updateUserInfo}>Save</SaveButton>}
                title="Edit profile">
      <FlexBox height="198px" direction="column" alignItems="center" justifyContent="center" overflow="hidden" position="relative">
        {bannerImageUrl && <BannerImage src={bannerImageUrl} 
                                        zoom={bannerImageAdjustment.zoom}
                                        transformX={bannerImageAdjustment.transformX}
                                        transformY={bannerImageAdjustment.transformY}></BannerImage>}
        <FlexBox z-index="10" backgroundColor={IMAGE_OVERLAY_GREY} position="absolute" top="0" right="0" bottom="0" left="0"></FlexBox>
        <FlexBox gap="20px">
          <ImageUploadButton uploadImage={uploadBannerImage}></ImageUploadButton>
          {bannerImageUrl && <DeleteImageButton onClick={deleteBannerImage}></DeleteImageButton>}
        </FlexBox>
      </FlexBox>
      <FlexBox position="relative" width="max-content" margin="-43px 0px 0px 17px" borderRadius="1000px" backgroundColor={BACKGROUND_COLOR}>
        <LargeUserCircle imageLoaded={profileImageUrl} userData={{
          profileImageUrl: profileImageUrl,
          displayName: savedUserData.displayName,
          profileImageAdjustment: {
            zoom: profileImageAdjustment.zoom,
            transformX: profileImageAdjustment.transformX,
            transformY: profileImageAdjustment.transformY
          }
        }}>
        </LargeUserCircle>
        <FlexBox position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex="15">
          <ImageUploadButton uploadImage={uploadProfileImage}></ImageUploadButton>
        </FlexBox>
      </FlexBox>
      <FlexBox padding="0px 16px" direction="column">
        <DynamicFormInput name="name" label="Name" value={nameValue} onChange={changeNameValue}></DynamicFormInput>
      </FlexBox>
      <FlexBox padding="0px 16px 12px" direction="column">
        <DynamicFormInput wordMax={160} name="bio" label="Bio" textarea={true} value={bioValue} onChange={changeBioValue}></DynamicFormInput>
      </FlexBox>

    </PopupModal>
  )
}

export default ProfileEditForm
