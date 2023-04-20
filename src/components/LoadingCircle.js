import styled from "styled-components";
import { BACKGROUND_COLOR, PRIMARY_COLOR } from "./constants";

const LoadingCircleOuterContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  height: 27px;
  width: 27px;
  transform: translate(-50%, -50%);
`

const LoadingCircleInnerContainer = styled.div`
  position: relative;
  height: 27px;
  width: 27px;
  border-radius: 1000px;
  overflow: hidden;
  animation: rotate 600ms linear infinite;

  @keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;
const BlueCircle = styled.div`
  position: absolute;
  left: -4px;
  bottom: -4px;
  height: 16px;
  width: 16px;
  border-radius: 1000px;
  background-color: ${PRIMARY_COLOR};
`;
const MaskCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 20.4px;
  width: 20.4px;
  border-radius: 1000px;
  background-color: ${BACKGROUND_COLOR};
`;
const FadedBlueCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 27px;
  width: 27px;
  border-radius: 1000px;
  ${`background-color: ${PRIMARY_COLOR.slice(0, -1)}, 0.3);`}
`;
export const LoadingCircle = (props) => {

  return (
    <LoadingCircleOuterContainer>
      <LoadingCircleInnerContainer className={props.className}>
        <BlueCircle></BlueCircle>
        <FadedBlueCircle></FadedBlueCircle>
        <MaskCircle></MaskCircle>
      </LoadingCircleInnerContainer>
    </LoadingCircleOuterContainer>
  );
};
