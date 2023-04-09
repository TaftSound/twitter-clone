import styled from "styled-components";
import { StyledLogo } from "../styled-components";
import { TooltipContainer } from "../styled-components";

const ContainerButton = styled(TooltipContainer)`
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

const StyledButtonLogo = styled(StyledLogo)`
  opacity: ${props => props.onClick ? "100%" : "60%"};
  height: 20px;
  width: 20px;
`

export const InputButton = (props) => {

  return (
      <ContainerButton type="button" linkTitle={props.linkTitle}>
        <StyledButtonLogo onClick={props.onClick} path={props.path} />
      </ContainerButton>
  );
};
