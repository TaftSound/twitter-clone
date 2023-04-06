import PropTypes from "prop-types"
import { UserCircle } from "../styled-components";
import styled from "styled-components";
import { useState } from "react";
import { AudienceSelector } from "./AudienceSelector";
import { TweetInput } from "./TweetInput";
import { WhoCanReply } from "./WhoCanReply";
import { ButtonBar } from "./ButtonBar";

const NewTweetContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 16px;
`
const UserAccountContainer = styled.div`
  width: min-content;
  margin: 0px 12px 0px 0px;
  padding: 4px 0px 0px;
`
const NewTweetForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 4px 0px 0px;
`

const NewTweetEntry = (props) => {

  const userAccountInitial = props.userName[0]

  const [currentTextState, setCurrentTextState] = useState('')

  const updateValue = (event) => {
    const newValue = event.target.value
    setCurrentTextState(newValue)
  }

  const submitTweet = () => {
    console.log(currentTextState)
  }

  return (
    <NewTweetContainer>
      <UserAccountContainer>
        <UserCircle data-testid="user-initial">{userAccountInitial}</UserCircle>
      </UserAccountContainer>
      <NewTweetForm>
        <AudienceSelector/>
        <TweetInput value={currentTextState} updateValue={updateValue}/>
        <WhoCanReply/>
        <ButtonBar submitTweet={submitTweet}/>
      </NewTweetForm>
    </NewTweetContainer>
  );
};

NewTweetEntry.propTypes = {
  userName: PropTypes.string.isRequired
}

export default NewTweetEntry
