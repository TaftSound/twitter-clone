import styled from "styled-components";
import { StyledLogo } from "../styled-components";
import { TooltipContainer } from "../styled-components";

const ButtonContainer = styled(TooltipContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 34px;
  width: 34px;
  padding: 0px;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const StyledButton = styled(StyledLogo)`
  opacity: ${props => props.onClick ? "100%" : "60%"};
  height: 20px;
  width: 20px;
`

export const InputButton = (props) => {

  return (
      <ButtonContainer type="button" linkTitle={props.linkTitle}>
        <StyledButton onClick={props.onClick} path={props.path} />
      </ButtonContainer>
  );
};
