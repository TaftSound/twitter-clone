import styled from "styled-components";

export const UserCircle = styled.button`
  border-radius: 50%;
  font-size: 20px;
  padding: 10px;
`

export const SmallUserCircle = styled(UserCircle)`
  font-size: 18px;
  padding: 8px;
`

export const DividerLine = styled.div`
  height: 1px;
  width: 100%;
  background-color: grey;
`

export const Container = styled.div`
  display: flex;
  padding: ${props => props.padding || "0px"};
  margin: ${props => props.margin || "0px"};
  flex-direction: ${props => props.flexDirection || "row"};
`