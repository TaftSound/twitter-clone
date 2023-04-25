import styled from "styled-components";
// import { PRIMARY_COLOR } from "../constants";

// This can be implemented as a feature later

  const OuterContainer = styled.div`
    /* height: 20px; */
    display: flex;
    align-items: center;
    /* padding: 4px 0px; */
  `
  // const TextButton = styled.h2`
  //   color: ${PRIMARY_COLOR};
  //   font-size: 16px;
  // `

const ShowMoreButton = (props) => {
  return (
    <OuterContainer>
      {/* <TextButton>Show more</TextButton> */}
    </OuterContainer>
  )
};


export default ShowMoreButton