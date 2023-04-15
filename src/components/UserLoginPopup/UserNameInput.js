import styled from "styled-components";
import { useState } from "react";
import { DIVIDER_COLOR, MAIN_FONT_COLOR, PRIMARY_COLOR, SECONDARY_FONT_COLOR } from "../constants";
import { useRef } from "react";
import { useEffect } from "react";
import PubSub from "pubsub-js";

const NameInputContainer = styled.div`
  position: relative;
  display: flex;
  border: solid 1px ${DIVIDER_COLOR};
  border-radius: 4px;
  margin: 12px 0px;
`;
const LabelOuterContainer = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
const FocusBorder = styled.div`
  position: absolute;
  z-index: 2;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  border: ${props => props.isFocused ? `solid 2px ${PRIMARY_COLOR}` : 'none'};
  border-radius: 5px;
`;
const LabelInnerContainer = styled.div`
  padding: ${props => props.isFocused || props.textContent ? '4px 10px 0px' : '16px 10px 0px'};
  transition: padding 150ms;
`;
const Label = styled.label`
  font-size: ${props => props.isFocused || props.textContent ? '14px' : '18px'};
  color: ${props => props.isFocused ? `${PRIMARY_COLOR}` : `${SECONDARY_FONT_COLOR}`};
  transition: font-size, color, 150ms;
`;
const InputContainer = styled.div`
  margin: 16px 0px 0px;
  padding: 12px 10px 8px;
  width: 100%;
`;
const Input = styled.input`
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  height: 20px;
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 500;
  padding: 0px;
  color: ${MAIN_FONT_COLOR};
`;

export const UserNameInput = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const focusInput = () => {
    const input = inputRef.current;
    input.focus();
    setIsFocused(true);
  };

  const defocusInput = () => { setIsFocused(false); };

  useEffect(() => {
    if (props.inputFocused) { focusInput() }
  }, [props.inputFocused])

  return (
    <NameInputContainer onFocus={focusInput} isFocused={isFocused}>
      <FocusBorder isFocused={isFocused}></FocusBorder>
      <LabelOuterContainer onClick={focusInput} isFocused={isFocused}>
        <LabelInnerContainer isFocused={isFocused} textContent={props.value}>
          {props.guest
            ? <Label isFocused={isFocused} textContent={props.value} htmlFor="username-input">Guest Username</Label>
            : false}
        </LabelInnerContainer>
      </LabelOuterContainer>
      <InputContainer>
        <Input ref={inputRef} name="username-input" value={props.value} onChange={props.onChange} onBlur={defocusInput}></Input>
      </InputContainer>
    </NameInputContainer>
  );
};
