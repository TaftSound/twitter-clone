import { useEffect } from "react"
import { useState } from "react"
import styled from "styled-components"
import PubSub from "pubsub-js"
import { updateUserProfile } from "../../firebase/firestore/user-functions"
import DynamicFormInput from "../DynamicFormInput"
import PopupModal from "../PopupModal/PopupModal"
import { FlexBox } from "../styled-components"
import { FormButton } from "../StyledButtons/FormButton"

const SaveButton = styled(FormButton)`
  height: 32px;
  font-size: 15px;
`
const ProfileEditForm = (props) => {
  const [nameValue, setNameValue] = useState('')
  const [bioValue, setBioValue] = useState('')

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

  return (
    <PopupModal removePopup={props.finishProfileEdit}
                headerButton={<SaveButton onClick={updateUserInfo}>Save</SaveButton>}
                title="Edit profile">
      {/* banner image input */}
      {/* user image input */}
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