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
import { BACKGROUND_COLOR, DARK_OVERLAY_COLOR, TRANSPARENT_DARK_GREY } from "../constants"

const SaveButton = styled(FormButton)`
  height: 32px;
  font-size: 15px;
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

const PhotoButton = styled(SmallMenuButton)`
  height: 44px;
  width: 44px;
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
      <PhotoButton title='Add photo' className={props.className} onClick={clickInput} medium={true} path="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z" />
    </>
  )
}

const ProfileImageUploadButton = styled(ImageUploadButton)`
  background-color: ${TRANSPARENT_DARK_GREY};
  opacity: 80%;
  transition: background-color 200ms;

  &:hover {
    background-color: rgb(35, 40, 45, 0.75);
  }
`

const ProfileEditForm = (props) => {
  const [nameValue, setNameValue] = useState('')
  const [bioValue, setBioValue] = useState('')
  const [bannerFile, setBannerFile] = useState(false)
  const [bannerUrl, setBannerUrl] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState(false)
  const [bannerImageAdjuster, setBannerImageAdjuster] = useState(false)
  const [profileImageAdjuster, setProfileImageAdjuster] = useState(false)

  const changeNameValue = (event) => {
    const newValue = event.target.value
    setNameValue(newValue)
  }
  const changeBioValue = (event) => {
    const newValue = event.target.value
    setBioValue(newValue)
  }

  useEffect(() => {
    if (props.name) { setNameValue(props.name) }
    if (props.bio) { setBioValue(props.bio) }
  }, [props.bio, props.name])

  const updateUserInfo = async () => {
    try {
      const newProfileData = {}
      if (nameValue !== props.name) { newProfileData.displayName = nameValue }
      if (bioValue !== props.bio) { newProfileData.bio = bioValue }
      await updateUserProfile(newProfileData)
      PubSub.publish('update user data', newProfileData)
      props.finishProfileEdit()
    } catch (error) {
      console.error("Failure to update profile info", error)
    }
  }

  const uploadBannerImage = async (imgFile) => {
    const imgUrl = URL.createObjectURL(imgFile)
    setBannerFile(imgFile)
    setBannerUrl(imgUrl)
    setBannerImageAdjuster(true)
  }
  const applyBannerAdjustment = async (bannerDisplayData) => {

  }
  const uploadProfileImage = async (imgFile) => {
    const imgUrl = URL.createObjectURL(imgFile)
    setProfileImageFile(imgFile)
    setProfileImageUrl(imgUrl)
    setProfileImageAdjuster(true)
  }
  const applyProfileImageAdjustment = async (bannerDisplayData) => {

  }
  const hideImageAdjuster = () => {
    setBannerImageAdjuster(false)
    setProfileImageAdjuster(false)
  }

  if (bannerImageAdjuster) {
    return (
      <ImageAdjuster applyFunction={applyBannerAdjustment} 
                     backFunction={hideImageAdjuster}
                     imageUrl={bannerUrl} />
    )
  }
  if (profileImageAdjuster) {
    return (
      <ImageAdjuster applyFunction={applyProfileImageAdjustment}
                     backFunction={hideImageAdjuster}
                     imageUrl={profileImageUrl} />
    )
  }

  return (
    <PopupModal removePopup={props.finishProfileEdit}
                headerButton={<SaveButton onClick={updateUserInfo}>Save</SaveButton>}
                title="Edit profile">
      <FlexBox height="198px" direction="column" alignItems="center" justifyContent="center">
        <ImageUploadButton uploadImage={uploadBannerImage}></ImageUploadButton>
      </FlexBox>
      {/* user image input */}
      <FlexBox position="relative" width="max-content" margin="-43px 0px 0px 17px">
        <LargeUserCircle imageLoaded={profileImageUrl}>
          {props.name[0]}
        </LargeUserCircle>
        <FlexBox position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex="15">
          <ProfileImageUploadButton uploadImage={uploadProfileImage}></ProfileImageUploadButton>
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


  // Create user display name input - DONE
  // Create user Bio input - DONE
  // Create functionality to update firestore for user profile - DONE
  // Create display for user bio - DONE
  // Create banner image form input - DONE
  // Create user image form input - DONE
  // Create image resizer component - DONE
  // Implement saving of image adjustment
  // Create database storage and firestore url storage for image upload