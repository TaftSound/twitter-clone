import styled from "styled-components";

import { MAIN_FONT_COLOR, SEARCH_BAR_BACKGROUND, WHO_TO_FOLLOW_BACKGROUND } from '../constants'
import ShowMoreButton from "./ShowMoreButton";
import UserDisplayTab from "./UserDisplayTab";


const OuterContainer = styled.div`
  width: 100%;
`
const InnerContainer = styled.div`
  width: 100%
  display: flex;
  flex-direction: column;
  background-color: ${WHO_TO_FOLLOW_BACKGROUND};
  border-radius: 15px;
  /* ${props => props.mainFeed ? 'margin: 12px 16px;' : ''} */
  ${props => props.mainFeed ? 'border-radius: 0px;' : ''}
`
const ItemContainer = styled.div`
  padding: 12px 16px;
  ${props => props.onClick ? `cursor: pointer;` : ''}

  &:hover {
    ${props => props.onClick ? `background-color: ${SEARCH_BAR_BACKGROUND}` : ''}
  }
`
const Header = styled.h1`
  color: ${MAIN_FONT_COLOR};
  font-size: 21px;
  margin: 0px;
`

const fakeUserOne = {
  userName: "BillyBob",
  displayName: "Billy"
}
const fakeUserTwo = {
  userName: "TheRock",
  displayName: "Dwayne"
}

const WhoToFollow = (props) => {

  return (
    <OuterContainer>
      <InnerContainer mainFeed={props.mainFeed}>
        <ItemContainer><Header>Who to follow</Header></ItemContainer>
        <ItemContainer onClick={() => {}}>
          <UserDisplayTab userObject={fakeUserOne}></UserDisplayTab>
        </ItemContainer>
        <ItemContainer onClick={() => {}}>
          <UserDisplayTab userObject={fakeUserTwo}></UserDisplayTab>
        </ItemContainer>
        <ItemContainer>
          <ShowMoreButton></ShowMoreButton>
        </ItemContainer>
      </InnerContainer>
    </OuterContainer>
  )
}

export default WhoToFollow