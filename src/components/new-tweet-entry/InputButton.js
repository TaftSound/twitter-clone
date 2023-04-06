import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 34px;
  width: 34px;
`;

export const InputButton = (props) => {
  const Svg = props.svg;

  return (
    <Container>
      <Svg color="blue" height="20px" />
    </Container>
  );
};
