import styled from "styled-components";
import autoAnimate from "@formkit/auto-animate";
import PubSub from "pubsub-js";

import { useContext, useEffect, useMemo, useState, useRef } from "react";

import { AudienceSelector } from "./AudienceSelector";
import { TweetInput } from "./TweetInput";
import { WhoCanReply } from "./WhoCanReply";
import { ButtonBar } from "./ButtonBar";
import { UserCircle } from "../styled-components";
import TweetDisplay from "../TweetDisplay/TweetDisplay";
import { CloseButton } from "../StyledButtons/CloseButton";

import { FollowContext, UserContext } from "../../App";
import { DIVIDER_COLOR, PRIMARY_COLOR } from "../constants";

import { createNewTweet } from "../../firebase/firestore/create-new-tweet";


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
const ImageContainer = styled.div`
  max-width: 100%;
  position: relative;
`
const Img = styled.img`
  width: 100%;
`
const ImgDeleteButton = styled(CloseButton)`
  position: absolute;
  top: 10px;
  left: 10px;
`


const LoadingBar = styled.div`
  position: absolute;
  z-index: 10;
  width: 20px;
  height: 4px;
  border-radius: 100px;
  top: 0px;
  left: -5px;
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
  const [readyToUpload, setReadyToUpload] = useState(false)
  const [tweetUploadingState, setTweetUploadingState] = useState(false)
  const [imageUrls, setImageUrls] = useState([])
  const [imageFiles, setImageFiles] = useState([])

  const formParent = useRef(null)
  const tweetsParent = useRef(null)
  const userParent = useRef(null)

  const newTweetRef = useRef(null)

  useEffect(() => {
    tweetsParent.current && autoAnimate(tweetsParent.current, { duration: 200 })
    formParent.current && autoAnimate(formParent.current, { duration: 50 })
    userParent.current && autoAnimate(userParent.current, { duration: 25 })
  },[formParent, userParent])

  useEffect(() => {
    if (props.popup) { setInputExpandedState(true) }
  }, [props.popup])

  useEffect(() => {
    if (userContext) { setAccountInitial(userContext.displayName[0]) }
  }, [userContext])
  
  const checkUploadReady = useMemo(() => {
    if (imageUrls[0] || currentTextState) {
      return true
    } else return false
  }, [imageUrls, currentTextState])

  useEffect(() => {
    if (checkUploadReady) {
      setReadyToUpload(true)
    } else setReadyToUpload(false)
  }, [checkUploadReady])

  const updateValue = (event) => {
    const newValue = event.target.value
    setCurrentTextState(newValue)
  }

  const submitTweet = async () => {
    setTweetUploadingState(true)
    const tweetData = await createNewTweet(currentTextState, imageFiles, userContext, followers)
    const newTweet = <TweetDisplay tweetData={{...tweetData, ...userContext}} key={tweetData.tweetId}></TweetDisplay>
    newTweetRef.current = newTweet
    setCurrentTextState('')
    setInputExpandedState(false)
    setTweetUploadingState(false)
    setImageUrls([])
    setImageFiles([])
    setTimeout(() => {
      PubSub.publish('display new tweet', newTweet)
      if (props.popup) { props.removePopup() }
      // setNewTweetsArray((oldTweets) => { return [newTweet, ...oldTweets] })
    }, 250)
  }

  useEffect(() => {
    if (props.popup) { return }
    const listenerToken = PubSub.subscribe('display new tweet', (msg, newTweet) => {
      setNewTweetsArray((oldTweets) => { return [newTweet, ...oldTweets] })
    })

    return () => {
      PubSub.unsubscribe(listenerToken)
    }
  }, [props.popup])

  const uploadImage = (event) => {
    const imageFile = event.target.files[0]
    const imgUrl = URL.createObjectURL(imageFile)
    setImageFiles((oldFiles) => {
      return [...oldFiles, imageFile]
    })
    setImageUrls((imageUrls) => {
      return [...imageUrls, imgUrl]
    })
  }
  const removeImage = (index) => {
    const imgUrls = [...imageUrls]
    const imgFiles = [...imageFiles]
    imgUrls.splice(index, 1)
    imgFiles.splice(index, 1)
    setImageUrls(imgUrls)
    setImageFiles(imgFiles)
  }

  const expandTweetInput = () => {
    setInputExpandedState(true)
  }

  return (
    <OuterContainer>
    {tweetUploadingState && props.popup ? <LoadingBar></LoadingBar> : false}
      <NewTweetEntryContainer popup={props.popup}>
        {tweetUploadingState && !props.popup ? <LoadingBar></LoadingBar> : false}
        <UserAccountContainer>
          <UserCircle data-testid="user-initial" ref={userParent}>
            {accountInitial}
            {tweetUploadingState && <UserCircleOverlay/>}
          </UserCircle>
        </UserAccountContainer>
        <NewTweetForm ref={formParent}>
          {tweetUploadingState ? false : <AudienceSelector expanded={inputExpandedState}/>}
          <TweetInput value={currentTextState}
            updateValue={updateValue}
            expandTweetInput={expandTweetInput}
            popup={props.popup} />
          {imageUrls[0] && imageUrls.map((imageUrl, index) => {
            return (
              <ImageContainer key={index}>
                <Img src={imageUrl} alt="uploaded-image"></Img>
                <ImgDeleteButton onClick={() => { removeImage(index) }}></ImgDeleteButton>
              </ImageContainer>
            )
          })}
          {tweetUploadingState ? false : <WhoCanReply expanded={inputExpandedState}/>}
          {tweetUploadingState 
          ? false
          : <ButtonBar submitTweet={submitTweet} 
                       uploadImage={uploadImage}
                       tweetReady={readyToUpload}
                       />}
        </NewTweetForm>
      </NewTweetEntryContainer>
      <OuterContainer ref={tweetsParent}>{newTweetsArray}</OuterContainer>
    </OuterContainer>
  );
};

export default NewTweetEntry
