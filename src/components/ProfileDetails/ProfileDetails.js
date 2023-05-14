import { useMemo, useContext } from "react"
import styled from "styled-components"

import LoadingPage from "../LoadingPage/LoadingPage"
import { UserCircle, SmallGreyLogo, FlexBox } from "../styled-components"
import { FormButton } from "../StyledButtons/FormButton"
import { BACKGROUND_COLOR, DIVIDER_COLOR, MAIN_FONT_COLOR, SECONDARY_FONT_COLOR } from "../constants"

import { FollowContext, UserContext } from "../../App"
import ProfileEditForm from "./ProfileEditForm"
import { useState } from "react"


const BannerContainer = styled.div`
  position: relative;
  height: 200px;
  background-color: ${DIVIDER_COLOR};
  overflow: hidden;
`

const Image = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  ${props => props.transformX && `transform: translate(${-50 + props.transformX}%, ${-50 + props.transformY}%);`}
  ${props => props.zoom && `width: ${props.zoom * 100}%;`}
`

const ProfileImageBanner = (props) => {
  const userContext = useContext(UserContext)
  const { bannerImageAdjustment } = userContext

  return (
    <BannerContainer>
      {userContext.bannerImageUrl
       && <Image src={userContext.bannerImageUrl}
                   transformX={bannerImageAdjustment.transformX}
                   transformY={bannerImageAdjustment.transformY}
                   zoom={bannerImageAdjustment.zoom}></Image>}
    </BannerContainer>
  )
}

const LargeUserCircle = styled(UserCircle)`
  box-sizing: content-box;
  padding: 0px;
  height: 133.5px;
  width: 133.5px;
  font-size: 75px;
  background-color: ${BACKGROUND_COLOR};
  border: solid 4px ${BACKGROUND_COLOR};
  position: absolute;
  left: 16px;
  transform: translateY(-50%);
  overflow: hidden;
`

// const ProfileUserCircle = (props) => {
//   const userContext = useContext(UserContext)
//   const { profileImageAdjustment } = userContext

//   return (
//     <LargeUserCircle>
//       {!userContext.profileImageUrl && userContext.displayName[0]}
//       {userContext.profileImageUrl
//       && <Image src={userContext.profileImageUrl}
//                    transformX={profileImageAdjustment.transformX}
//                    transformY={profileImageAdjustment.transformY}
//                    zoom={profileImageAdjustment.zoom}></Image>}
//     </LargeUserCircle>
//   )
// }

const UserDetailsContainer = styled.div`
  box-sizing: border-box;
  min-height: 200px;
  padding: 12px 16px 0px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`

const EditProfileButton = styled(FormButton)`
  margin-top: 0px;
`
const H1 = styled.h1`
  margin: 0px;
  color: ${MAIN_FONT_COLOR};
  font-size: 21px;
  font-weight: 900;
`
const H2 = styled.h2`
  margin: 0px;
  color: ${SECONDARY_FONT_COLOR};
  font-size: 16px;
  font-weight: 400;
`
const H3 = styled.h3`
  margin: 0px;
  color: ${SECONDARY_FONT_COLOR};
  font-size: 15px;
  font-weight: 400;
`
const BoldH3 = styled(H3)`
  font-weight: 700;
  color: ${MAIN_FONT_COLOR};
  margin-right: 4px;
`
const BioText = styled.span`
  font-size: 16px;
  color: ${MAIN_FONT_COLOR};
  color: white;
`

const UserDetails = (props) => {
  const followContext = useContext(FollowContext)
  const userContext = useContext(UserContext)
  const [editProfile, setEditProfile] = useState(false)

  const startProfileEdit = () => {
    setEditProfile(true)
  }

  const finishProfileEdit = () => {
    setEditProfile(false)
  }

  const memoizedJoinDate = useMemo(() => {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July",
                          "August", "September", "October", "November", "December"]
      const { timestamp } = userContext
      const date = new Date(+timestamp)
      const month = monthNames[date.getMonth()]
      const year = date.getFullYear()
      return `${month} ${year}`
  }, [userContext])

  return (
    <>
      <UserDetailsContainer>
        <FlexBox height="68.5px" justifyContent="space-between">
          <div></div>
          <EditProfileButton onClick={startProfileEdit} dark={true} small={true}>Edit profile</EditProfileButton>
        </FlexBox>
        <FlexBox margin="4px 0px 15px" direction="column" alignItems="flex-start">
          <H1>{userContext.displayName}</H1>
          <H2>@{userContext.userName}</H2>
        </FlexBox>
        {userContext.bio
        ? <FlexBox margin="0px 0px 12px">
          <BioText>{userContext.bio}</BioText>
        </FlexBox>
        : false }
        <FlexBox margin="0px 0px 12px">
          <FlexBox margin="0px 4px 0px 0px">
            <SmallGreyLogo path="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"/>
          </FlexBox>
          <H2>Joined {memoizedJoinDate}</H2>
        </FlexBox>
        <FlexBox>
          <FlexBox margin="0px 20px 0px 0px">
            <BoldH3>{followContext.following.length}</BoldH3>
            <H3>Following</H3>
          </FlexBox>
          <BoldH3>{followContext.followers.length}</BoldH3>
          <H3>Followers</H3>
        </FlexBox>
      </UserDetailsContainer>
      {editProfile ? <ProfileEditForm finishProfileEdit={finishProfileEdit}></ProfileEditForm> : false}
    </>
  )
}

const ProfileDetailsContainer = styled.div`

`

const ProfileDetails = (props) => {
  const userContext = useContext(UserContext)

  if (userContext) {
    return (
      <ProfileDetailsContainer>
        <ProfileImageBanner></ProfileImageBanner>
        <LargeUserCircle userData={userContext}></LargeUserCircle>
        <UserDetails></UserDetails>
      </ProfileDetailsContainer>
    )
  } else {
    return (
      <LoadingPage></LoadingPage>
    )
  }
}

export default ProfileDetails