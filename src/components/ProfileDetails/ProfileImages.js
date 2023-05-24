import styled from "styled-components";
import { LargeUserCircle } from "../styled-components";
import { DIVIDER_COLOR } from "../constants";

const BannerContainer = styled.div`
  position: relative;
  // Padding bottom trick
  width: 100%;
  padding-bottom: 33%;
  height: 0px;

  background-color: ${DIVIDER_COLOR};
  overflow: hidden;

  @media (min-width: 690px) {
    height: 200px;
    padding-bottom: 0px;
  }
`;
const Image = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  ${props => `transform: translate(${-50 + props.transformX}%, ${-50 + props.transformY}%);`}
  ${props => props.zoom && `width: ${props.zoom * 100}%;`}
`;
export const ProfileImageBanner = (props) => {
  const { context } = props
  const { bannerImageAdjustment } = context;

  return (
    <BannerContainer>
      {context.bannerImageUrl
        && <Image src={context.bannerImageUrl}
          transformX={bannerImageAdjustment.transformX}
          transformY={bannerImageAdjustment.transformY}
          zoom={bannerImageAdjustment.zoom}></Image>}
    </BannerContainer>
  );
};
export const ProfileUserCircle = (props) => {
  const { context } = props
  const { profileImageAdjustment } = context;

  return (
    <LargeUserCircle userData={context}>
      {!context.profileImageUrl && context.displayName[0]}
      {context.profileImageUrl
        && <Image src={context.profileImageUrl}
          transformX={profileImageAdjustment.transformX}
          transformY={profileImageAdjustment.transformY}
          zoom={profileImageAdjustment.zoom}></Image>}
    </LargeUserCircle>
  );
};
