import styled from "styled-components"
import { MAIN_FONT_COLOR } from "../constants"
import PopupModal from "../PopupModal/PopupModal"
import { FlexBox } from "../styled-components"

const H1 = styled.h1`
  color: ${MAIN_FONT_COLOR};
  font-size: 26px;
  font-weight: 900;
  margin: 0px 0px 10px;
`

const P = styled.p`
  color: ${MAIN_FONT_COLOR};
  font-size: 17px;
  margin: 4px 0px;
`
const Strong = styled.strong`
  color: ${MAIN_FONT_COLOR};
  font-size: 18px;
  font-weight: 900;
`

const GuestUserExplanation = (props) => {
  return (
    <PopupModal backFunction={props.backFunction} twitterLogo={true} scroll={true} slideRight={props.slideRight}>
      <FlexBox margin="0px 32px 32px" direction="column">
        <FlexBox justifyContent="center">
          <H1>To guest or not to guest</H1>
        </FlexBox>
        <FlexBox margin="10px 0px" direction="column">
          <P><Strong>Guest Login: </Strong></P>
          <P>As a guest, you're free to explore Tweeter
          without any long-term commitment. You can post tweets and like others' posts,
          but your activity will only be visible to you. Any tweets you post or likes you
          give won't be seen by other users. Also, keep in mind that your guest profile
          and activities won't be saved for future visits. It's a great way to get a feel
          for Tweeter's functionality, but it's a transient experience.</P>
        </FlexBox>
        <FlexBox margin="10px 0px" direction="column">
          <P><Strong>Creating an Account: </Strong></P>
          <P>If you're ready to dive into the full
          Tweeter experience, creating an account is the way to go. Not only will your
          account be saved for future visits, but you'll also be part of the Tweeter
          community. The tweets you post and the ones you like will be visible to other
          users, letting you participate in the lively conversations happening on Tweeter.</P>
        </FlexBox>
      </FlexBox>
    </PopupModal>
  )
}

export default GuestUserExplanation