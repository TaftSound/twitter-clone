import styled from "styled-components";
import PropTypes from "prop-types"

const Container = styled.div`
  padding: 12px 0px;
`;
const Input = styled.input`
  padding: 2px 0px;
`;

export const TweetInput = (props) => {
  return (
    <Container>
      <Input
        type="text"
        placeholder="What's happening?"
        value={props.currentTextState}
        onChange={props.updateValue} />
    </Container>
  );
};

TweetInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  updateValue: PropTypes.func.isRequired
}
