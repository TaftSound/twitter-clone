import styled from "styled-components";
import PropTypes from "prop-types"
import { FONT_FAMILY, MAIN_FONT_COLOR } from "../constants";

const Container = styled.div`
  padding: 14px 0px;
`;
const Input = styled.input`
  background-color: transparent;
  color: ${MAIN_FONT_COLOR};
  border: none;
  padding: 0px 0px;
  margin: 0px 0px 2px 2px;
  font-size: 21px;
  font-weight: 400;
  font-family: ${FONT_FAMILY};

  &:focus {
    border: none;
    outline: none;
  }
`;

export const TweetInput = (props) => {
  return (
    <Container>
      <Input
        type="text"
        placeholder="What's happening?"
        value={props.currentTextState}
        onChange={props.updateValue}
        onFocus={props.expandTweetInput}
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
