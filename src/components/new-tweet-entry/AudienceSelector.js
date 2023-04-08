import styled from "styled-components";
import { BUTTON_BORDER_COLOR, FONT_FAMILY, PRIMARY_COLOR, SECONDARY_FONT_COLOR } from "../constants";
import { StyledLogo } from "../styled-components";


const Container = styled.div`
  padding: 0px 0px 12px;
`;
const Button = styled.button`
  border: solid 1px ${BUTTON_BORDER_COLOR};
  border-radius: 25px;
  padding: 0px 12px 0px 12px;
  margin: 2px;
  margin-bottom: 0px;
  height: 24px;
  display: flex;
  gap: 4px;
  align-items: center;
  color: ${PRIMARY_COLOR};
  background-color: transparent;
  font-family: ${FONT_FAMILY};
  font-size: 14px;
  line-height: 22px;
  font-weight: 700;
`;

const NewStyledLogo = styled(StyledLogo)`
  margin-bottom: -2px;
`

export const AudienceSelector = (props) => {
  if (!props.expanded) { return false }
  return (
    <Container data-testid="audience-selector">
      <Button type="button">
        Everyone
        <NewStyledLogo path="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z" />
      </Button>
    </Container>
  );
};
