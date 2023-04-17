import PropTypes from "prop-types"
import { UserCircle } from "../styled-components";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { AudienceSelector } from "./AudienceSelector";
import { TweetInput } from "./TweetInput";
import { WhoCanReply } from "./WhoCanReply";
import { ButtonBar } from "./ButtonBar";

const NewTweetContainer = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: min-content 1fr;
  padding: 4px 16px 8px;
  overflow: visible;
`
const UserAccountContainer = styled.div`
  width: min-content;
  position: relative;
  height: 100%;
  margin: 0px 12px 0px 0px;
  padding: 4px 0px 0px;
  overflow: visible;
`
const NewTweetForm = styled.form`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 4px 0px 0px;
  overflow: visible;
`

const NewTweetEntry = (props) => {

  const userAccountInitial = props.displayName[0]

  const [currentTextState, setCurrentTextState] = useState('')
  const [inputExpandedState, setInputExpandedState] = useState(false)

  useEffect(() => {
    if (props.popup) { setInputExpandedState(true) }
  }, [props.popup])

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
          expandTweetInput={expandTweetInput}
          popup={props.popup} />
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
