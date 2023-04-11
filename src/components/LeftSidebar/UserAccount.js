import styled from "styled-components";
import { SmallUserCircle } from "../styled-components";

const Container = styled.div`
  padding: 12px;
  margin: 16px 0px;
`

const UserAccountButton = (props) => {
  const userAccountInitial = props.userName[0]

  const userAccountMessage = () => {

  }

  return (
    <Container>
      <SmallUserCircle onClick={userAccountMessage}>{userAccountInitial}</SmallUserCircle>
    </Container>
  )
}

export default UserAccountButton