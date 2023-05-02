import styled from "styled-components";
import autoAnimate from "@formkit/auto-animate";

import { useContext, useEffect, useState } from "react";

import { AudienceSelector } from "./AudienceSelector";
import { TweetInput } from "./TweetInput";
import { WhoCanReply } from "./WhoCanReply";
import { ButtonBar } from "./ButtonBar";
import { UserCircle } from "../styled-components";

import { FollowContext, UserContext } from "../../App";
import { DIVIDER_COLOR, PRIMARY_COLOR } from "../constants";

import { createNewTweet } from "../../firestore/create-new-tweet";
import { useRef } from "react";
import TweetDisplay from "../TweetDisplay/TweetDisplay";


const OuterContainer = styled.div`

`

const NewTweetEntryContainer = styled.div`
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
const UserCircleOverlay = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgb(0, 0, 0, 0.4);
  border-radius: 1000px;
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
`
const NewTweetForm = styled.form`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 4px 0px 0px;
  overflow: visible;
`

// PLAN ANIMATION
  // What happens to tweet entry container?
  // Everything except user logo and and tweet text is removed
  // loading bar animation starts
  // new tweet creation function is called
  // upon successful tweet creation, new tweet is added to bottom of tweet entry container
  // this is done by adding it to an array, so that multiple new tweets can be added
  // tweet entry container is reset back to neutral state


const LoadingBar = styled.div`
  position: absolute;
  width: 20px;
  height: 4px;
  border-radius: 100px;
  top: 0px;
  left: -10px;
  background-color: ${PRIMARY_COLOR};
  animation: loadProgress 2s ease-out;

  @keyframes loadProgress {
    from {
      width: 20px;
    }
    to {
      width: 100%;
    }
  }
`

const NewTweetEntry = (props) => {
  const userContext = useContext(UserContext) 
  const followContext = useContext(FollowContext)
  const { followers } = followContext

  const [currentTextState, setCurrentTextState] = useState('')
  const [inputExpandedState, setInputExpandedState] = useState(false)
  const [accountInitial, setAccountInitial] = useState('')
  const [newTweetsArray, setNewTweetsArray] = useState([])
  const [tweetUploadingState, setTweetUploadingState] = useState(false)

  const formParent = useRef(null)
  const tweetsParent = useRef(null)
  const userParent = useRef(null)

  const newTweetRef = useRef(null)

  useEffect(() => {
    tweetsParent.current && autoAnimate(tweetsParent.current, { duration: 250 })
    formParent.current && autoAnimate(formParent.current, { duration: 75 })
    userParent.current && autoAnimate(userParent.current, { duration: 50 })
  },[formParent, tweetsParent, userParent])

  useEffect(() => {
    if (props.popup) { setInputExpandedState(true) }
  }, [props.popup])

  useEffect(() => {
    if (userContext) {
      setAccountInitial(userContext.displayName[0])
    }
  }, [userContext])

  const updateValue = (event) => {
    const newValue = event.target.value
    setCurrentTextState(newValue)
  }

  const submitTweet = async () => {
    setTweetUploadingState(true)
    const tweetData = await createNewTweet(currentTextState, userContext, followers)
    const newTweet = <TweetDisplay tweetData={{...tweetData, ...userContext}} key={tweetData.tweetId}></TweetDisplay>
    newTweetRef.current = newTweet
    setCurrentTextState('')
    setInputExpandedState(false)
    setTweetUploadingState(false)
    setNewTweetsArray((oldTweets) => { return [newTweet, ...oldTweets] })
  }

  const expandTweetInput = () => {
    setInputExpandedState(true)
  }

  return (
    <OuterContainer>
      <NewTweetEntryContainer popup={props.popup}>
        {tweetUploadingState ? <LoadingBar></LoadingBar> : false}
        <UserAccountContainer>
          <UserCircle data-testid="user-initial" ref={userParent}>
            {accountInitial}
            {tweetUploadingState ? <UserCircleOverlay/> : ''}
          </UserCircle>
        </UserAccountContainer>
        <NewTweetForm ref={formParent}>
          {tweetUploadingState ? false : <AudienceSelector expanded={inputExpandedState}/>}
          <TweetInput value={currentTextState}
            updateValue={updateValue}
            expandTweetInput={expandTweetInput}
            popup={props.popup} />
          {tweetUploadingState ? false : <WhoCanReply expanded={inputExpandedState}/>}
          {tweetUploadingState ? false : <ButtonBar submitTweet={submitTweet} tweetText={currentTextState}/>}
        </NewTweetForm>
      </NewTweetEntryContainer>
      <OuterContainer ref={tweetsParent}>{newTweetsArray}</OuterContainer>
    </OuterContainer>
  );
};

export default NewTweetEntry
