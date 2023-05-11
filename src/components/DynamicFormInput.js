import styled from "styled-components";
import { useState } from "react";
import { DIVIDER_COLOR, FONT_FAMILY, MAIN_FONT_COLOR, PRIMARY_COLOR, SECONDARY_FONT_COLOR } from "./constants";
import { useRef } from "react";
import { useLayoutEffect } from "react";
import { useEffect } from "react";

const DynamicInputContainer = styled.div`
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
  padding: ${props => props.isFocused || props.textContent ? '4px 8px 0px' : '16px 8px 0px'};
  transition: padding 150ms;
`;
const Label = styled.label`
  font-size: ${props => props.isFocused || props.textContent ? '14px' : '18px'};
  color: ${props => props.isFocused ? `${PRIMARY_COLOR}` : `${SECONDARY_FONT_COLOR}`};
  transition: font-size, color, 150ms;
`;
const InputContainer = styled.div`
  margin: 16px 0px 0px;
  padding: 12px 8px 8px;
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
  font-family: ${FONT_FAMILY};
  font-size: 18px;
  font-weight: 500;
  padding: 0px;
  color: ${MAIN_FONT_COLOR};
`;
const TextArea = styled.textarea`
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  height: 68px;
  margin-bottom: -8px;
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  resize: none;
  overflow: visible;
  font-family: ${FONT_FAMILY};
  font-size: 17px;
  font-weight: 500;
  padding: 0px;
  color: ${MAIN_FONT_COLOR};
`;

const WordCount = styled.span`
  color: ${SECONDARY_FONT_COLOR};
  position: absolute;
  top: 5px;
  right: 5px;
`

const DynamicFormInput = (props) => {
  const [isText, setIsText] = useState(true)
  const [isTextArea, setIsTextArea] = useState(false)

  useEffect(() => {
    if (props.textarea) {
      setIsText(false)
      setIsTextArea(true)
    }
  }, [props.textarea])

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const focusInput = () => {
    const input = inputRef.current;
    input.focus();
    setIsFocused(true);
  };

  const defocusInput = () => { setIsFocused(false); };

  useLayoutEffect(() => {
    if (props.inputFocused) { focusInput() }
  }, [props.inputFocused])

  const changeFunction = (event) => {
    if (props.wordMax 
    && (props.value.length >= props.wordMax)
    && event.nativeEvent.inputType !== "deleteContentBackward"
    && event.nativeEvent.inputType !== "deleteContentForward") {
      return
    }
    props.onChange(event)
  }

  return (
    <DynamicInputContainer onFocus={focusInput} isFocused={isFocused}>
      <FocusBorder isFocused={isFocused}></FocusBorder>
      <LabelOuterContainer onClick={focusInput} isFocused={isFocused}>
        <LabelInnerContainer isFocused={isFocused} textContent={props.value}>
          <Label isFocused={isFocused} textContent={props.value} htmlFor={props.name}>{props.label}</Label>
        </LabelInnerContainer>
      </LabelOuterContainer>
      <InputContainer>
        {props.wordMax && <WordCount>{props.value.length}/{props.wordMax}</WordCount>}
        {isText && <Input ref={inputRef} name={props.name} value={props.value} onChange={changeFunction} onBlur={defocusInput}></Input>}
        {isTextArea && <TextArea ref={inputRef} name={props.name} value={props.value} onChange={changeFunction} onBlur={defocusInput}></TextArea>}
      </InputContainer>
    </DynamicInputContainer>
  );
};

export default DynamicFormInput