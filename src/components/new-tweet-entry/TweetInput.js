import styled from "styled-components";
import PropTypes from "prop-types"
import { FONT_FAMILY, MAIN_FONT_COLOR } from "../constants";
import { useEffect, useRef } from "react";

const Container = styled.div`
  padding: 12px 0px;
`;
const Input = styled.textarea`
  background-color: transparent;
  color: ${MAIN_FONT_COLOR};
  border: none;
  padding: 2px 0px;
  margin: 0px 2px 2px 2px;
  height: 24px;
  width: calc(100% - 16px);
  resize: none;
  font-size: 21px;
  font-weight: 400;
  font-family: ${FONT_FAMILY};

  &:focus {
    border: none;
    outline: none;
  }
`;

export const TweetInput = (props) => {
  const textareaRef = useRef(null)
  
  useEffect(() => {
    const textarea = textareaRef.current
    textarea.style.height = '24px'
    const height = textarea.scrollHeight
    textarea.style.height = `${height}px`
  }, [props.value])

  useEffect(() => {
    if (props.popup) {
      const textarea = textareaRef.current
      textarea.style.minHeight = "82px"
    }
  }, [props.popup])
  
  return (
    <Container>
      <Input
        wrap="hard"
        placeholder="What's happening?"
        value={props.value}
        onChange={props.updateValue}
        onFocus={props.expandTweetInput}
        id="tweetInput"
        ref={textareaRef}
         />
    </Container>
  );
};

TweetInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  updateValue: PropTypes.func.isRequired,
  expandTweetInput: PropTypes.func.isRequired
}
