import { UserCircle } from "../styled-components";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { AudienceSelector } from "./AudienceSelector";
import { TweetInput } from "./TweetInput";
import { WhoCanReply } from "./WhoCanReply";
import { ButtonBar } from "./ButtonBar";
import { UserContext } from "../../App";
import { createNewTweet } from "../../firestore/create-new-tweet";
import { DIVIDER_COLOR } from "../constants";

const NewTweetContainer = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: min-content 1fr;
  padding: 4px 16px 8px;
  overflow: visible;
  ${props => props.popup ? '' : `border-bottom: solid 1px ${DIVIDER_COLOR};`}
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
  const userObject = useContext(UserContext).userData

  const [currentTextState, setCurrentTextState] = useState('')
  const [inputExpandedState, setInputExpandedState] = useState(false)
  const [accountInitial, setAccountInitial] = useState('')

  useEffect(() => {
    if (props.popup) { setInputExpandedState(true) }
  }, [props.popup])

  useEffect(() => {
    if (userObject) {
      setAccountInitial(userObject.displayName[0])
    }
  }, [userObject])

  const updateValue = (event) => {
    const newValue = event.target.value
    setCurrentTextState(newValue)
  }

  const submitTweet = () => { createNewTweet(currentTextState, userObject) }

  const expandTweetInput = () => {
    setInputExpandedState(true)
  }
  const collapseTweetInput = () => {
    setInputExpandedState(false)
  }

  return (
    <NewTweetContainer popup={props.popup}>
      <UserAccountContainer>
        <UserCircle data-testid="user-initial">{accountInitial}</UserCircle>
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

export default NewTweetEntry
