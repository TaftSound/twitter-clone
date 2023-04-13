import styled from "styled-components";
import { BACKGROUND_COLOR, SECONDARY_FONT_COLOR } from "../constants";

const SuggestionBoxContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 20px 40px;
  background-color: ${BACKGROUND_COLOR};
  box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px;
  border-radius: 8px;
`;
const SuggestionBoxText = styled.p`
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  width: 100%;
  color: ${SECONDARY_FONT_COLOR};
`;
const SearchSuggestionBox = (props) => {
  return (
    <SuggestionBoxContainer>
      <SuggestionBoxText>This is a UI only implementation of Twitter's search bar</SuggestionBoxText>
      <SuggestionBoxText>Search functionality has not yet been implemented</SuggestionBoxText>
    </SuggestionBoxContainer>
  );
};

export default SearchSuggestionBox