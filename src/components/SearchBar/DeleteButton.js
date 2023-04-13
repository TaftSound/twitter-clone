import styled from "styled-components";
import { BACKGROUND_COLOR, PRIMARY_COLOR } from "../constants";

const DeleteButtonInnerContainer = styled.div`
  position: relative;
  outline: none;
  border: none;
  height: 22px;
  width: 22px;
  margin-right: 12px;
  border-radius: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${PRIMARY_COLOR};
  cursor: pointer;
`;
const DeleteIcon = styled.svg`
  height: 10px;
  width: 10px;
`;
const DeleteIconPath = styled.path`
  fill: ${BACKGROUND_COLOR};
`;
const DeleteButtonOverlay = styled.div`
  background-color: black;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 1000px;
  opacity: 0%;
  transition: opacity 100ms;

  &:hover {
    opacity: ${props => props.internalClick ? "25%" : "10%"};
  }
  
`;

const DeleteButton = (props) => {
  return (
    <DeleteButtonInnerContainer onMouseUp={props.onMouseUp}>
      <DeleteIcon viewBox="0 0 15 15">
        <DeleteIconPath d="M6.09 7.5L.04 1.46 1.46.04 7.5 6.09 13.54.04l1.42 1.42L8.91 7.5l6.05 6.04-1.42 1.42L7.5 8.91l-6.04 6.05-1.42-1.42L6.09 7.5z" />
      </DeleteIcon>
      <DeleteButtonOverlay internalClick={props.internalClick} />
    </DeleteButtonInnerContainer>
  );
};


export default DeleteButton