import PropTypes from "prop-types"
import { UserCircle } from "../styled-components";
import styled from "styled-components";
import { useState } from "react";
import { AudienceSelector } from "./AudienceSelector";
import { TweetInput } from "./TweetInput";
import { WhoCanReply } from "./WhoCanReply";
import { ButtonBar } from "./ButtonBar";

const NewTweetContainer = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr;
  padding: 4px 16px 8px;
`
const UserAccountContainer = styled.div`
  width: min-content;
  height: 100%;
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
  const [inputExpandedState, setInputExpandedState] = useState(false)

  const updateValue = (event) => {
    const newValue = event.target.value
    setCurrentTextState(newValue)
  }

  const submitTweet = () => {
    console.log(currentTextState)
  }

  const expandTweetInput = () => {
    setInputExpandedState(true)
  }
  const collapseTweetInput = () => {
    setInputExpandedState(false)
  }

  return (
    <NewTweetContainer>
      <UserAccountContainer>
        <UserCircle data-testid="user-initial">{userAccountInitial}</UserCircle>
      </UserAccountContainer>
      <NewTweetForm>
        <AudienceSelector expanded={inputExpandedState}/>
        <TweetInput value={currentTextState} 
          updateValue={updateValue}
          expandTweetInput={expandTweetInput} />
        <WhoCanReply expanded={inputExpandedState}/>
        <ButtonBar submitTweet={submitTweet} tweetText={currentTextState}/>
      </NewTweetForm>
    </NewTweetContainer>
  );
};

NewTweetEntry.propTypes = {
  userName: PropTypes.string.isRequired
}

export default NewTweetEntry
