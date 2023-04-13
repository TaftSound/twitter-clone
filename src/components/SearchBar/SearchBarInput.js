import styled from "styled-components";
import { FONT_FAMILY, MAIN_FONT_COLOR, SECONDARY_FONT_COLOR } from "../constants";

const SearchBarInput = styled.input`
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  outline: none;
  box-sizing: border-box;
  height: 42px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  font-family: ${FONT_FAMILY};
  color: ${MAIN_FONT_COLOR};

  &::placeholder {
    color: ${SECONDARY_FONT_COLOR};
    opacity: 1;
    font-weight: 400;
  }
  &:focus::placeholder {
    font-weight: 400;
  }
`;

export default SearchBarInput