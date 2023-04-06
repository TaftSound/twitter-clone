import styled from "styled-components";

const Container = styled.div`
  padding: 0px 0px 12px;
`;
const Button = styled.button`
  border: solid 1px grey;
  border-radius: 25px;
  padding: 5px 10px;
  color: blue;
`;

export const AudienceSelector = (props) => {
  return (
    <Container data-testid="audience-selector">
      <Button type="button">Everyone</Button>
    </Container>
  );
};
